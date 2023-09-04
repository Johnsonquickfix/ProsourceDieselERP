namespace LaylaERP.Controllers.API
{
    using Newtonsoft.Json.Linq;
    using Models.qfk.Content;
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;
    using System.Net;
    using System.Net.Http;
    using System.Threading.Tasks;
    using System.Web;
    using System.Web.Http;

    [RoutePrefix("api/editor")]
    public class EditorController : ApiController
    {
        [HttpPost, Route("auth")]
        public IHttpActionResult Auth([FromBody] AuthModel request)
        {
            try
            {
                EditorResponse editorResponse = new EditorResponse();
                editorResponse.success = true;
                editorResponse.data = new JObject();
                editorResponse.data.Add("token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InByb2plY3RJZCI6MTY3fSwiaWF0IjoxNjgzNTQ1MTM2fQ.IqvH9jh9WsTWbVtrGR2hLcF5ERLZWUK55ynZTQrr9r0");
                return Ok(editorResponse);
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.InternalServerError, new { message = ex.Message });
            }
        }

        [HttpPost, Route("session")]
        public IHttpActionResult Session([FromBody] AuthModel request)
        {
            try
            {
                EditorResponse editorResponse = new EditorResponse();
                editorResponse.success = true;
                editorResponse.data = JObject.FromObject(new
                {
                    isAuthenticated = true,
                    token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InByb2plY3RJZCI6MTY3fSwiaWF0IjoxNjgzNTQ1MTM2fQ.IqvH9jh9WsTWbVtrGR2hLcF5ERLZWUK55ynZTQrr9r0",
                    user = new { id = "" },
                    project = new
                    {
                        id = 167,
                        name = "Editor",
                        storage = true,
                        fonts = new List<FontModel>() {
                            new FontModel{ label= "Arial Black",value= "arial black,AvenirNext-Heavy,avant garde,arial",url= ""},
                            new FontModel{ label= "Andale Mono",value= "andale mono,times",url= ""},
                            new FontModel{ label= "Arial",value= "arial,helvetica,sans-serif",url= ""},
                            new FontModel{ label= "Book Antiqua",value= "book antiqua,palatino",url= ""},
                            new FontModel{ label= "Comic Sans MS",value= "comic sans ms,sans-serif",url= ""},
                            new FontModel{ label= "Courier New",value= "courier new,courier",url= ""},
                            new FontModel{ label= "Georgia",value= "georgia,palatino",url= ""},
                            new FontModel{ label= "Helvetica",value= "helvetica,sans-serif",url= ""},
                            new FontModel{ label= "Impact",value= "impact,chicago",url= ""},
                            new FontModel{ label= "Symbol",value= "symbol",url= ""},
                            new FontModel{ label= "Tahoma",value= "tahoma,arial,helvetica,sans-serif",url= ""},
                            new FontModel{ label= "Terminal",value= "terminal,monaco",url= ""},
                            new FontModel{ label= "Times New Roman",value= "times new roman,times",url= ""},
                            new FontModel{ label= "Trebuchet MS",value= "trebuchet ms,geneva",url= ""},
                            new FontModel{ label= "Verdana",value= "verdana,geneva",url= ""},
                            new FontModel{ label= "Lobster Two",value= "Lobster Two',cursive",url= "https://fonts.googleapis.com/css?family=Lobster+Two:400,700"},
                            new FontModel{ label= "Playfair Display",value= "'Playfair Display',serif",url= "https://fonts.googleapis.com/css?family=Playfair+Display:400,700"},
                            new FontModel{ label= "Rubik",value= "'Rubik',sans-serif",url= "https://fonts.googleapis.com/css?family=Rubik:400,700"},
                            new FontModel{ label= "Source Sans Pro",value= "'Source Sans Pro',sans-serif",url= "https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,700"},
                            new FontModel{ label= "Open Sans",value= "'Open Sans',sans-serif",url= "https://fonts.googleapis.com/css?family=Open+Sans:400,700"},
                            new FontModel{ label= "Crimson Text",value= "'Crimson Text',serif",url= "https://fonts.googleapis.com/css?family=Crimson+Text:400,700"},
                            new FontModel{ label= "Montserrat",value= "'Montserrat',sans-serif",url= "https://fonts.googleapis.com/css?family=Montserrat:400,700"},
                            new FontModel{ label= "Old Standard TT",value= "'Old Standard TT',serif",url= "https://fonts.googleapis.com/css?family=Old+Standard+TT:400,700"},
                            new FontModel{ label= "Lato",value= "'Lato',sans-serif",url= "https://fonts.googleapis.com/css?family=Lato:400,700"},
                            new FontModel{ label= "Raleway",value= "'Raleway',sans-serif",url= "https://fonts.googleapis.com/css?family=Raleway:400,700"},
                            new FontModel{ label= "Cabin",value= "'Cabin',sans-serif",url= "https://fonts.googleapis.com/css?family=Cabin:400,700"},
                            new FontModel{ label= "Pacifico",value= "'Pacifico',cursive",url= "https://fonts.googleapis.com/css?family=Pacifico"},
                        },
                        mergeTags = new List<string>(),
                        tools = new List<string>(),
                        overrideDefaultFeatures = new { audit = false }
                    },
                    subscription = new
                    {
                        status = "ACTIVE",
                        entitlements = new
                        {
                            audit = true,
                            branding = true,
                            collaboration = true,
                            displayConditions = true,
                            imageEditor = true,
                            stockImages = true,
                            userUploads = true,
                            allowedDomains = 3,
                            allowedProjects = 2,
                            customFonts = true,
                            customTools = 5,
                            customTabs = 5,
                            customBlocks = 10,
                            uploadMaxSize = 10000000,
                            teamLimit = 1000,
                            templateFolders = 1000,
                            campaignFolders = 1000,
                            customMergeTags = 1000,
                            export = true,
                            smartHeadings = false,
                            smartText = false,
                            smartButtons = false,
                            magicImage = false,
                            sendTestEmail = true,
                            customJS = true,
                            customCSS = true
                        },
                        items = new { timer = new { }, video = new { }, social = new { } },
                        addons = new { timer = new { }, video = new { }, social = new { } },
                    },
                });
                return Ok(editorResponse);
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.InternalServerError, new { message = ex.Message });
            }
        }

        [HttpPost, Route("usage")]
        public IHttpActionResult Usage([FromBody] AuthModel request)
        {
            try
            {
                EditorResponse editorResponse = new EditorResponse();
                editorResponse.success = true;

                return Ok(editorResponse);
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.InternalServerError, new { message = ex.Message });
            }
        }

        [HttpPost, Route("save")]
        public IHttpActionResult save([FromBody] AuthModel request)
        {
            try
            {
                EditorResponse editorResponse = new EditorResponse();
                editorResponse.success = true;

                return Ok(editorResponse);
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.InternalServerError, new { message = ex.Message });
            }
        }

        [HttpGet, Route("icons/{id}")]
        public IHttpActionResult Icons(string id)
        {
            try
            {
                EditorResponse editorResponse = new EditorResponse();
                editorResponse.success = true;
                editorResponse.data = JObject.FromObject(new
                {
                    image = new List<string>() { "<svg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"tag\" class=\"svg-inline--fa fa-tag fa-3x\" role=\"img\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 448 512\"><path fill=\"currentColor\" d=\"M0 80V229.5c0 17 6.7 33.3 18.7 45.3l176 176c25 25 65.5 25 90.5 0L418.7 317.3c25-25 25-65.5 0-90.5l-176-176c-12-12-28.3-18.7-45.3-18.7H48C21.5 32 0 53.5 0 80zm112 96c-17.7 0-32-14.3-32-32s14.3-32 32-32s32 14.3 32 32s-14.3 32-32 32z\"></path></svg>" },
                    name = "fa-tag"
                });
                return Ok(editorResponse);
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.InternalServerError, new { message = ex.Message });
            }
        }

        [HttpGet, Route("blocks")]
        public IHttpActionResult Blocks([FromUri] AuthModel request)
        {
            try
            {
                EditorResponse editorResponse = new EditorResponse();
                editorResponse.success = true;
                //editorResponse.data = new List<string>();
                return Ok(editorResponse);
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.InternalServerError, new { message = ex.Message });
            }
        }

        [HttpPost, Route("images/upload-url")]
        public IHttpActionResult UploadURL([FromBody] FileUploadModel request)
        {
            try
            {
                EditorResponse editorResponse = new EditorResponse();
                editorResponse.success = true;
                editorResponse.data = JObject.FromObject(new
                {
                    key = string.Format("projects/158371/{0}", request.filename),
                    presignedPost = new
                    {
                        url = "https://s3.amazonaws.com/unlayer-assets-prod",
                        fields = new
                        {
                            acl = "public-read",
                            key = string.Format("projects/158371/{0}", request.filename),
                            success_action_status = "201",
                            Tagging = "<Tagging><TagSet><Tag><Key>UnlayerProjectId</Key><Value>158371</Value></Tag></TagSet></Tagging>",
                            bucket = "unlayer-assets-prod",
                            //"X-Amz-Algorithm": "AWS4-HMAC-SHA256",
                            //"X-Amz-Credential": "AKIA3D6DWN35FWQBE7HC/20230511/us-east-1/s3/aws4_request",
                            //"X-Amz-Date": "20230511T110916Z",
                            //"Policy": "eyJleHBpcmF0aW9uIjoiMjAyMy0wNS0xMVQxMjowOToxNloiLCJjb25kaXRpb25zIjpbWyJjb250ZW50LWxlbmd0aC1yYW5nZSIsMCwxMDAwMDAwMDBdLFsic3RhcnRzLXdpdGgiLCIkQ29udGVudC1UeXBlIiwiaW1hZ2UvIl0seyJhY2wiOiJwdWJsaWMtcmVhZCJ9LHsia2V5IjoicHJvamVjdHMvMTU4MzcxLzE2ODM4MDMzNTYwNzUtMTAwNzIxMDkxMzUyLUxheWxhLU1lbW9yeS1Gb2FtLU1hdHRyZXNzLmpwZyJ9LHsic3VjY2Vzc19hY3Rpb25fc3RhdHVzIjoiMjAxIn0seyJUYWdnaW5nIjoiPFRhZ2dpbmc+PFRhZ1NldD48VGFnPjxLZXk+VW5sYXllclByb2plY3RJZDwvS2V5PjxWYWx1ZT4xNTgzNzE8L1ZhbHVlPjwvVGFnPjwvVGFnU2V0PjwvVGFnZ2luZz4ifSx7ImJ1Y2tldCI6InVubGF5ZXItYXNzZXRzLXByb2QifSx7IlgtQW16LUFsZ29yaXRobSI6IkFXUzQtSE1BQy1TSEEyNTYifSx7IlgtQW16LUNyZWRlbnRpYWwiOiJBS0lBM0Q2RFdOMzVGV1FCRTdIQy8yMDIzMDUxMS91cy1lYXN0LTEvczMvYXdzNF9yZXF1ZXN0In0seyJYLUFtei1EYXRlIjoiMjAyMzA1MTFUMTEwOTE2WiJ9XX0=",
                            //"X-Amz-Signature": "91cbb35b8ac120db058e4f20b6166e7d155e1705215a0b55e09d0ba7aca6f00d"
                        }
                    }
                });
                return Ok(editorResponse);
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.InternalServerError, new { message = ex.Message });
            }
        }

        [HttpPost, Route("images")]
        public async Task<IHttpActionResult> UploadImage()
        {
            try
            {
                string _baseURL = "https://quickfixclay.quickwebsitefix.com/";
                // Check if the request contains multipart/form-data.  
                if (!Request.Content.IsMimeMultipartContent())
                {
                    throw new HttpResponseException(HttpStatusCode.UnsupportedMediaType);
                }
                var provider = new MultipartMemoryStreamProvider();
                var content = await Request.Content.ReadAsMultipartAsync(provider);
                string path = @"/Uploads/EditorImage", file_name = string.Empty, _id = DateTime.UtcNow.ToString("yyyyMMddHHmmss");
                if (!Directory.Exists(HttpContext.Current.Server.MapPath(path))) Directory.CreateDirectory(HttpContext.Current.Server.MapPath(path));
                foreach (var file in provider.Contents)
                {
                    // Seems kind of hackish as a method for determining where the file name is in the content stream
                    if (file.Headers.ContentDisposition.FileName != null)
                    {
                        file_name = _id + "_" + file.Headers.ContentDisposition.FileName.Trim('\"');
                        var medisStream = await file.ReadAsStreamAsync();
                        string filePath = HttpContext.Current.Server.MapPath(path + "/" + file_name);
                        using (var sw = new FileStream(filePath, FileMode.Create))
                        {
                            await medisStream.CopyToAsync(sw);
                        }
                    }
                }
                FileInfo fi = new FileInfo(HttpContext.Current.Server.MapPath(path + "/" + file_name));

                EditorResponse editorResponse = new EditorResponse();
                editorResponse.success = true;
                editorResponse.data = JObject.FromObject(new
                {
                    id = _id,
                    location = string.Format("{0}/{1}/{2}", _baseURL, path, file_name),
                    contentType = "image/jpeg",
                    size = fi.Length,
                    width = HttpContext.Current.Request.Form["width"],
                    height = HttpContext.Current.Request.Form["height"]
                });
                return Ok(editorResponse);
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.InternalServerError, new { message = ex.Message });
            }
        }
    }
}
