/*global chrome*/
/* src/content.js */
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import Draggable from "react-draggable";
import Frame, { FrameContextConsumer } from "react-frame-component";
import App from "./App";
import { TextWrapper } from "./styles";

function Main() {
  // console.log("hello i'm here");
  const [selectedText, setSelectedText] = useState("");
  const [translatedText, setTranslatedText] = useState([""]);

  document.addEventListener("mouseup", () => {
    if (window.getSelection) {
      setSelectedText(window.getSelection().toString());
    } else if (document.selection && document.selection.type != "Control") {
      setSelectedText(document.selection.createRange().text);
    }
  });

  useEffect(() => {
    axios
      .get(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=uz&dt=t&q=${selectedText}`
      )
      .then((res) => {
        setTranslatedText("");
        let str = "";
        console.log(res.data);
        res.data[0].forEach((v) => {
          console.log(translatedText + v[0]);
          str += v[0];
          // console.log(v[0]);
        });

        setTranslatedText(str);
      })
      .catch();
  }, [selectedText]);

  // document.styleSheets[0].insertRule('body::selection { background-color: red !important; }', 0);
  // document.styleSheets[0].cssRules[0].style.backgroundColor= 'red';

  const [isPlay, setIsPlay] = useState(false);

  const [speed, setSpeed] = useState(1);

  const audioRef = useRef();

  return (
    <>
      {selectedText && (
        <Frame
          head={[
            <link
              type="text/css"
              rel="stylesheet"
              href={chrome.runtime.getURL("/static/css/content.css")}
            ></link>,
          ]}
        >
          <FrameContextConsumer>
            {({ document, window }) => {
              return (
                <>
                  <div className="card-box">
                    {/* {selectedText} <br /> */}
                    <div className="audio-wrapper">
                      <div className="audio-play">
                        {isPlay ? (
                          <img
                            onClick={() => {
                              audioRef.current.pause();
                              setIsPlay(true);
                            }}
                            src={chrome.runtime.getURL(
                              "static/media/pause-button.png"
                            )}
                            alt="logo"
                          />
                        ) : (
                          <img
                            onClick={() => {
                              audioRef.current.play();
                              setIsPlay(true);
                            }}
                            src={chrome.runtime.getURL(
                              "static/media/speaker-filled-audio-tool.png"
                            )}
                            alt="play"
                          />
                        )}
                        <div className="audio-control">
                          <div className="speed">
                            {/* {speed} */}
                            <button
                              className={speed === 2 && "active-speed"}
                              onClick={() => {
                                audioRef.current.defaultPlaybackRate = 2;
                                setSpeed(2);
                              }}
                            >
                              2.0
                            </button>
                            <button
                              className={speed === 1 && "active-speed"}
                              onClick={() => {
                                audioRef.current.defaultPlaybackRate = 1;
                                setSpeed(1);
                              }}
                            >
                              1.0
                            </button>
                            <button
                              className={speed === 0.5 && "active-speed"}
                              onClick={() => {
                                audioRef.current.defaultPlaybackRate = 0.5;
                                setSpeed(0.5);
                              }}
                            >
                              0.5
                            </button>
                            {/* <input
                              type="range"
                              step={0.5}
                              min={-0.5}
                              max={2}
                              value={speed}
                              onChange={(e) => {
                                setSpeed(e.target.value);
                                audioRef.current.defaultPlaybackRate =
                                  e.target.value;
                              }}
                            /> */}
                          </div>
                        </div>
                      </div>
                      {/* {translatedText.map((v) => ( */}
                      <audio
                        ref={audioRef}
                        onPause={() => setIsPlay(false)}
                        onEnded={() => setIsPlay(false)}
                        className="audio-tag"
                        defaultPlaybackRate={speed}
                        id="audio-tag"
                        src={`https://internal.nutq.uz/api/v1/cabinet/synthesize?t=${translatedText}`}
                        controls
                      ></audio>
                      {/* ))} */}

                      {
                        translatedText
                        // .map(()=>)
                      }
                    </div>
                  </div>
                </>
              );
              // <App document={document} window={window} isExt={true} />;
            }}
          </FrameContextConsumer>
        </Frame>
      )}
    </>
  );
}

const app = document.createElement("div");
app.id = "my-extension-root";
// app.setAttribute("draggable")
// app.addEventListener("mousedown",function(e){

// })

document.body.appendChild(app);
ReactDOM.render(<Main />, app);

// app.style.display = "none";

// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//   if (request.message === "clicked_browser_action") {
//     toggle();
//   }
// });

// function toggle() {
//   if (app.style.display === "none") {
//     app.style.display = "block";
//   } else {
//     app.style.display = "none";
//   }
// }
