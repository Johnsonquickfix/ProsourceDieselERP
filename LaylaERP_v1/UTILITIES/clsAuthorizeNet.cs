namespace LaylaERP.UTILITIES
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web;
    using AuthorizeNet.Api.Controllers;
    using AuthorizeNet.Api.Contracts.V1;
    using AuthorizeNet.Api.Controllers.Bases;

    public class clsAuthorizeNet
    {
        public static dynamic RefundTransaction(string TransactionID, string CardNumber, string ExpirationDate, decimal TransactionAmount)
        {
            string transId = string.Empty;
            String ApiLoginID = CommanUtilities.Provider.GetCurrent().AuthorizeAPILogin, ApiTransactionKey = CommanUtilities.Provider.GetCurrent().AuthorizeTransKey;
            ApiOperationBase<ANetApiRequest, ANetApiResponse>.RunEnvironment = AuthorizeNet.Environment.SANDBOX;

            // define the merchant information (authentication / transaction id)
            ApiOperationBase<ANetApiRequest, ANetApiResponse>.MerchantAuthentication = new merchantAuthenticationType()
            {
                name = ApiLoginID,
                ItemElementName = ItemChoiceType.transactionKey,
                Item = ApiTransactionKey
            };

            var request_invoice = new getTransactionDetailsRequest();
            request_invoice.transId = TransactionID;

            // instantiate the controller that will call the service
            var controller_invoice = new getTransactionDetailsController(request_invoice);
            controller_invoice.Execute();

            string typeEnum = transactionTypeEnum.voidTransaction.ToString();

            // get the response from the service (errors contained if any)
            var response_invoice = controller_invoice.GetApiResponse();
            if (response_invoice != null && response_invoice.messages.resultCode == messageTypeEnum.Ok)
            {
                if (response_invoice.transaction.transactionStatus == "capturedPendingSettlement")
                    typeEnum = transactionTypeEnum.voidTransaction.ToString();
                else if (response_invoice.transaction.transactionStatus == "settledSuccessfully")
                    typeEnum = transactionTypeEnum.refundTransaction.ToString();
            }
            else
            {
                typeEnum = transactionTypeEnum.voidTransaction.ToString();
            }

            var creditCard = new creditCardType { cardNumber = CardNumber, expirationDate = ExpirationDate };

            //standard api call to retrieve response
            var paymentType = new paymentType { Item = creditCard };

            var transactionRequest = new transactionRequestType
            {
                transactionType = typeEnum,    // refund type
                payment = paymentType,
                amount = TransactionAmount,
                refTransId = TransactionID,
            };
            //transactionRequest.order.invoiceNumber = OrderID;

            var request = new createTransactionRequest { transactionRequest = transactionRequest };

            // instantiate the controller that will call the service
            var controller = new createTransactionController(request);
            controller.Execute();

            // get the response from the service (errors contained if any)
            var response = controller.GetApiResponse();

            // validate response
            if (response != null)
            {
                if (response.messages.resultCode == messageTypeEnum.Ok)
                {
                    if (response.transactionResponse.messages != null)
                    {
                        transId = response.transactionResponse.transId;
                        Console.WriteLine("Successfully created transaction with Transaction ID: " + response.transactionResponse.transId);
                        Console.WriteLine("Response Code: " + response.transactionResponse.responseCode);
                        Console.WriteLine("Message Code: " + response.transactionResponse.messages[0].code);
                        Console.WriteLine("Description: " + response.transactionResponse.messages[0].description);
                        Console.WriteLine("Success, Auth Code : " + response.transactionResponse.authCode);
                    }
                    else
                    {
                        transId = string.Empty;
                        Console.WriteLine("Failed Transaction.");
                        if (response.transactionResponse.errors != null)
                        {
                            Console.WriteLine("Error Code: " + response.transactionResponse.errors[0].errorCode);
                            Console.WriteLine("Error message: " + response.transactionResponse.errors[0].errorText);
                        }
                    }
                }
                else
                {
                    transId = string.Empty;
                    Console.WriteLine("Failed Transaction.");
                    if (response.transactionResponse != null && response.transactionResponse.errors != null)
                    {
                        Console.WriteLine("Error Code: " + response.transactionResponse.errors[0].errorCode);
                        Console.WriteLine("Error message: " + response.transactionResponse.errors[0].errorText);
                    }
                    else
                    {
                        Console.WriteLine("Error Code: " + response.messages.message[0].code);
                        Console.WriteLine("Error message: " + response.messages.message[0].text);
                    }
                }
            }
            else
            {
                transId = string.Empty;
                Console.WriteLine("Null Response.");
            }

            return transId;
        }

        public static ANetApiResponse GetTransactionDetails(string ApiLoginID, string ApiTransactionKey, string TransactionID)
        {
            string transId = string.Empty;
            //String ApiLoginID = CommanUtilities.Provider.GetCurrent().AuthorizeAPILogin, ApiTransactionKey = CommanUtilities.Provider.GetCurrent().AuthorizeTransKey;
            ApiOperationBase<ANetApiRequest, ANetApiResponse>.RunEnvironment = AuthorizeNet.Environment.SANDBOX;

            // define the merchant information (authentication / transaction id)
            ApiOperationBase<ANetApiRequest, ANetApiResponse>.MerchantAuthentication = new merchantAuthenticationType()
            {
                name = ApiLoginID,
                ItemElementName = ItemChoiceType.transactionKey,
                Item = ApiTransactionKey
            };

            var request = new getTransactionDetailsRequest();
            request.transId = TransactionID;

            // instantiate the controller that will call the service
            var controller = new getTransactionDetailsController(request);
            controller.Execute();

            // get the response from the service (errors contained if any)
            var response = controller.GetApiResponse();
            if (response != null && response.messages.resultCode == messageTypeEnum.Ok)
            {
                if (response.transaction == null) return response;
                //Console.WriteLine("Transaction Id: {0}", response.transaction.transId);
                //Console.WriteLine("Transaction type: {0}", response.transaction.transactionType);
                //Console.WriteLine("Transaction status: {0}", response.transaction.transactionStatus);
                //Console.WriteLine("Transaction auth amount: {0}", response.transaction.authAmount);
                //Console.WriteLine("Transaction settle amount: {0}", response.transaction.settleAmount);
            }
            //else if (response != null)
            //{
            //    Console.WriteLine("Error: " + response.messages.message[0].code + "  " + response.messages.message[0].text);
            //}

            return response;
        }
    }
}