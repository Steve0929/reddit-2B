import nodeHtmlToImage from "node-html-to-image/dist/index.js";
import { AVATAR_IMAGE_PATH, AVATAR_REPLY_IMAGE_PATH, BACKGROUND_IMAGE_PATH, TITLE_IMAGE_PATH, TMP_PATH, UPVOTE_COLOR } from "./constants.js";
import { createRandomId, localImageToUri } from "./utils.js";

export const createImageFromText = async (text, user, upvotes, config, globalConf) => {
    const path = `${TMP_PATH}/${globalConf.videoID}/${createRandomId()}.png`;
    const { gradient, initialImage, isReply } = config;

    const avatarImageSource = initialImage ? localImageToUri(TITLE_IMAGE_PATH) : localImageToUri(AVATAR_IMAGE_PATH);
    const backgroundImageSource = initialImage ? localImageToUri(BACKGROUND_IMAGE_PATH) : '';
    const replyImageSource = localImageToUri(AVATAR_REPLY_IMAGE_PATH);

    await nodeHtmlToImage({
        html: `<html>
            <head>
            <style>
                body {
                    width: 1080px;
                    height: fit-content;
                    font-family: system-ui;
                }
                .card{
                    background: white;
                    border-radius: 12px;
                    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
                    padding: 2rem;
                    width: 950px;
                    display: flex;
                    font-size: 2rem;
                    flex-direction: column;
                    align-items: center;
                    ${initialImage && `color: white;  text-shadow: 0 0 6px black; background: url(${backgroundImageSource}); background-size: contain;`}
                    ${gradient ? `background: linear-gradient(135deg, rgb(206, 159, 252) 0%, rgb(115, 103, 240) 100%); color: white;` : ``}
                }
                .image-left{
                    margin-right: 2rem;
                }
                .upvotes {
                    font-weight: 600;
                    font-size: 2.5rem;
                    margin-top: 2rem;
                    display: flex;
                    align-items: center;
                }
                .numbers {
                    color: ${UPVOTE_COLOR};
                    font-weight: 700;
                }
                .arrow {
                    border: solid #a5a7a8;
                    border-width: 0 8px 8px 0;
                    display: inline-block;
                    padding: 12px;
                    margin-left: 1rem;
                    margin-right: 1rem;
                }
                .up {
                    border: solid ${UPVOTE_COLOR};
                    border-width: 0 8px 8px 0;
                    transform: rotate(-135deg);
                    -webkit-transform: rotate(-135deg);
                }
                .up-title{
                    border: solid white;
                    border-width: 0 8px 8px 0;
                    transform: rotate(-135deg);
                    -webkit-transform: rotate(-135deg);
                }
                .down {
                    transform: rotate(45deg);
                    -webkit-transform: rotate(45deg);
                }
                .up-container {
                    transform: translate(0px, 8px);
                }
                .title {
                    font-size: 2.5rem;
                }
        
                .op {
                    font-size: 1.7rem;
                    font-weight: 600;
                }
                .no-shadow{
                    text-shadow: none;
                }
                .flex-container{
                    display: flex; 
                    align-items: center;
                }
                .reply{
                    display: flex; 
                    align-items: center; 
                    margin-top: 2rem; 
                    margin-left: 6rem;
                }
                .reply-font{
                    font-size: 1.5rem;
                }
            </style>
            </head>
            <body> 
             <div class="card" >
             ${initialImage ?
                `
                <div class="title flex-container">
                    <image src="{{avatarImageSource}}" height="350px" class="image-left" />
                    <div>
                        <b>${text}</b> <br />
                        <span class="op">u/${user}</span> <br />
                        <div class="upvotes">                            
                            <div class="up-container"><i class="arrow up-title"></i></div>                   
                            <div class='no-shadow'>${upvotes}</div>
                        </div>
                    </div>
                </div>
                `
                : `               
               <div class='flex-container'>
                   <image src="{{avatarImageSource}}" width="140px" class="image-left" />
                   <div>
                   <b>u/${user}</b> <br/>
                   ${text}
                    <div class="upvotes">
                            <div class="up-container"><i class="arrow up"></i></div>
                            <span class='numbers'>${upvotes}</span>
                            
                        </div>
                    </div>
               </div>
               `
            }
            ${isReply ?
                `<div class='flex-container reply'>
                    <image src="{{replyImageSource}}" width="120px" class="image-left" />
                    <div class='reply-font'>
                        <b>u/${config.reply_user}</b> <br/>
                        ${config.reply_text}
                        <div class="upvotes">
                            <div class="up-container"><i class="arrow up"></i></div>
                            <span class='numbers'>${config.reply_upvotes}</span>
                            
                        </div>
                    </div>
                </div>`
                : ''
            }

             </div >
          </body >
        </html > `,
        transparent: true,
        content: {
            avatarImageSource: avatarImageSource,
            backgroundImageSource: backgroundImageSource,
            replyImageSource: replyImageSource,
        },
        output: path,
        puppeteerArgs: {
            args: ['--no-sandbox'],
        }
    });
    return path;
}