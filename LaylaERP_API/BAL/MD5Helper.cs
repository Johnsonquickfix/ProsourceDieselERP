using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace LaylaERP_API.BAL
{
    public class MD5Helper
    {
        //Format used to format the md5 hash byte array (two lowercase hexadecimal numbers)
        private static readonly string m_strHexFormat = "x2";
        private MD5Helper() { }
        ///<summary>
        ///Use the current default character encoding to encrypt the string
        ///</summary>
        ///<param name="str">The string that needs md5 calculation</param>
        ///<returns>32-bit hexadecimal number string represented by lowercase letters</returns>
        public static string md5(string str)
        {
            return (string)md5(str, false, Encoding.Default);
        }
        ///<summary>
        ///Perform md5 hash calculation on the string
        ///</summary>
        ///<param name="str">The string that needs md5 calculation</param>
        ///<param name="raw_output">
        ///false returns the formatted encrypted string (equivalent to string md5(string))
        ///true returns the original md5 hash length 16 byte[] array
        ///</param>
        ///<returns>
        ///byte[] array or formatted string
        ///</returns>
        public static object md5(string str, bool raw_output)
        {
            return md5(str, raw_output, Encoding.Default);
        }
        ///<summary>
        ///Perform md5 hash calculation on the string
        ///</summary>
        ///<param name="str">The string that needs md5 calculation</param>
        ///<param name="raw_output">
        ///false returns the formatted encrypted string (equivalent to string md5(string))
        ///true returns the original md5 hash length 16 byte[] array
        ///</param>
        ///<param name="charEncoder">
        ///Used to specify the encoding type of the input string,
        ///When the input string contains multi-byte text (such as Chinese)
        ///It must be ensured that the character encoding used by the md5 hash for matching is the same,
        ///Otherwise the calculated md5 will not match.
        ///</param>
        ///<returns>
        ///byte[] array or formatted string
        ///</returns>
        public static object md5(string str, bool raw_output, Encoding charEncoder)
        {
            if (!raw_output) return md5str(str, charEncoder);
            else return md5raw(str, charEncoder);
        }

        ///<summary>
        ///Use the current default character encoding to encrypt the string
        ///</summary>
        ///<param name="str">The string that needs md5 calculation</param>
        ///<returns>32-bit hexadecimal number string represented by lowercase letters</returns>
        protected static string md5str(string str)
        {
            return md5str(str, Encoding.Default);
        }
        ///<summary>
        ///md5 encryption of the string
        ///</summary>
        ///<param name="str">The string that needs md5 calculation</param>
        ///<param name="charEncoder">
        ///Specify the Encoding type to encode and decode the input string
        ///</param>
        ///<returns>32-bit hexadecimal number string represented by lowercase letters</returns>
        protected static string md5str(string str, Encoding charEncoder)
        {
            byte[] bytesOfStr = md5raw(str, charEncoder);
            int bLen = bytesOfStr.Length;
            StringBuilder pwdBuilder = new StringBuilder(32);
            for (int i = 0; i < bLen; i++)
            {
                pwdBuilder.Append(bytesOfStr[i].ToString(m_strHexFormat));
            }
            return pwdBuilder.ToString();
        }
        ///<summary>
        ///Use the current default character encoding to encrypt the string
        ///</summary>
        ///<param name="str">The string that needs md5 calculation</param>
        ///<returns>byte[] array with length 16</returns>
        protected static byte[] md5raw(string str)
        {
            return md5raw(str, Encoding.Default);
        }
        ///<summary>
        ///md5 encryption of the string
        ///</summary>
        ///<param name="str">The string that needs md5 calculation</param>
        ///<param name="charEncoder">
        ///Specify the Encoding type to encode and decode the input string
        ///</param>
        ///<returns>byte[] array with length 16</returns>
        protected static byte[] md5raw(string str, Encoding charEncoder)
        {
            //System.Security.Cryptography.MD5 md5 = System.Security.Cryptography.MD5.Create();
            System.Security.Cryptography.MD5 md5 = new System.Security.Cryptography.MD5CryptoServiceProvider();
            return md5.ComputeHash(charEncoder.GetBytes(str));
        }       
    }
}