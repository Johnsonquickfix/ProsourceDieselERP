var WarrantyQuestions = [
    {
        id: 1, code: 1101, title: "Item received damaged", type: 'warranty',
        questions: [{
            id: 1001, title: "Is the damage claim for the entire product?",
            sub_questions: [{ id: 10011, title: "The customer sends the image of the damage and the agent uploads to return order." }, { id: 10012, title: "The vendor requires the product to be shipped back to them." }, { id: 10013, title: "Creates a return label and emails to customer." }, { id: 10014, title: "Notifies shipping carrier and schedules pick up from customer’s home." }, { id: 10015, title: "Create return" }]
        }, {
            id: 1002, title: "Is the damage claim for just a part?",
            sub_questions: [{ id: 10021, title: "The customer sends the image of the damage and the agent uploads to return order." }, { id: 10022, title: "The vendor requires the product to be shipped back to them." }, { id: 10023, title: "Creates a return label and emails to customer." }, { id: 10024, title: "Notifies shipping carrier and schedules pick up from customer’s home." }, { id: 10025, title: "Create replacement" }]
        }]
    },
    {
        id: 2, code: 1102, title: "Wrong item received", type: 'warranty',
        questions: [{
            id: 2001, title: "Is the wrong item received?",
            sub_questions: [{ id: 20011, title: "The vendor requires the product to be shipped back to them." }, { id: 20012, title: "Creates a return label and emails to customer." }, { id: 20013, title: "Notifies shipping carrier and schedules pick up from customer’s home." }, { id: 20014, title: "Create replacement." }]
        }]
    },
    {
        id: 3, code: 1103, title: "Item received missing parts", type: 'warranty',
        questions: [{ id: 3001, title: "Parts must have their own individual SKUs." }, { id: 3002, title: "The product is within warranty terms." }, { id: 3003, title: "Was the part missing?" }, { id: 3004, title: "Was damaged out of the box?" }, { id: 3004, title: "Create new order for customer and add part to the order and process as normal." }]
    },
    {
        id: 4, code: 1104, title: "Part required under warranty", type: 'warranty',
        questions: [{ id: 4001, title: "Parts must have their own individual SKUs." }, { id: 4002, title: "The product is within warranty terms." }, { id: 4003, title: "Was the part missing?" }, { id: 4004, title: "Was damaged out of the box?" }, { id: 4004, title: "Create new order for customer and add part to the order and process as normal." }]
    },
    {
        id: 5, code: 1105, title: "Additional parts required", type: 'warranty',
        questions: [{ id: 5001, title: "Parts must have their own individual SKUs." }, { id: 5002, title: "The product is within warranty terms." }, { id: 5003, title: "Was the part missing?" }, { id: 5004, title: "Was damaged out of the box?" }, { id: 5004, title: "Create new order for customer and add part to the order and process as normal." }]
    },
    {
        id: 6, code: 1106, title: "Parts replacement out of warranty", type: 'warranty',
        questions: [{ id: 6001, title: "Parts must have their own individual SKUs." }, { id: 6002, title: "The product is within warranty terms." }, { id: 6003, title: "Was the part missing?" }, { id: 6004, title: "Was damaged out of the box?" }, { id: 6004, title: "Create new order for customer and add part to the order and process as normal." }]
    },
];

var StolenPackageQuestions = [
    { id: 9001, title: "Did you check the front of the house?" },
    { id: 9002, title: "Did you check the back of the house?" },
    { id: 9003, title: "Do you live in an apartment building where packages are held in a certain place?" },
    { id: 9004, title: "Have you asked property management or neighbours?" },
    { id: 9005, title: "Etc." }
];

