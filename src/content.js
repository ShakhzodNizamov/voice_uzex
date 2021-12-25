/*global chrome*/
/* src/content.js */
import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import Frame, { FrameContextConsumer } from "react-frame-component";
import App from "./App";
import { TextWrapper } from "./styles";

function Main() {
  // console.log("hello i'm here");
  const [selectedText, setSelectedText] = useState("");
  const [translatedText, setTranslatedText] = useState("");

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
        setTranslatedText("")
        let str = ""
        console.log(res.data);
        res.data[0].forEach((v)=>{
          console.log(translatedText + v[0]);
          str += v[0]
          // console.log(v[0]);
        });
        setTranslatedText(str);
      })
      .catch();
  }, [selectedText]);

  document.styleSheets[0].insertRule('body::selection { background-color: red !important; }', 0);
  document.styleSheets[0].cssRules[0].style.backgroundColor= 'red';

  return (
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
              {selectedText && (
                <TextWrapper>
                  Hello {selectedText} <br />
                  {translatedText}
                  <audio
                    src={`https://internal.nutq.uz/api/v1/cabinet/synthesize?t=${translatedText}`}
                    controls
                  ></audio>
                </TextWrapper>
              )}
            </>
          );
          // <App document={document} window={window} isExt={true} />;
        }}
      </FrameContextConsumer>
    </Frame>
  );
}

const app = document.createElement("div");
app.id = "my-extension-root";

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
