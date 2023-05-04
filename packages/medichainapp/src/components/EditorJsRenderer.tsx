import { OutputData } from "@editorjs/editorjs";
import React, { useRef } from "react";
import * as htmlToImage from "html-to-image";



//use require since editorjs-html doesn't have types
const editorJsHtml = require("editorjs-html");
const EditorJsToHtml = editorJsHtml();

type Props = {
  data: OutputData;
};

type ParsedContent = string | JSX.Element;

const EditorJsRenderer = ({ data }: Props) => {
  const editorRef = useRef(null);

  const handleDownloadImage = () => {
    if (editorRef.current) {
      const editorNode = editorRef.current;
      const editorWidth = editorNode.offsetWidth;
      const editorHeight = editorNode.offsetHeight;
      const originalWidth = window.innerWidth;
      const originalHeight = window.innerHeight;
  
      // Set the width and height of the editor to the viewport size
      editorNode.style.width = `${originalWidth}px`;
      editorNode.style.height = `${originalHeight}px`;
  
      htmlToImage
        .toPng(editorNode)
        .then(function (dataUrl) {
          const link = document.createElement("a");
          link.download = "image.png";
          link.href = dataUrl;
          link.click();
  
          // Reset the width and height of the editor to their original values
          editorNode.style.width = `${editorWidth}px`;
          editorNode.style.height = `${editorHeight}px`;
        })
        .catch(function (error) {
          console.error("oops, something went wrong!", error);
        });
    }
  };

  const html = EditorJsToHtml.parse(data) as ParsedContent[];
  return (
    <div>
      <div ref={editorRef} className="border">
        <div className="prose max-w-full" key={data.time}>
          {html.map((item, index) => {
            if (typeof item === "string") {
              return (
                <div dangerouslySetInnerHTML={{ __html: item }} key={index}></div>
              );
            }
            return item;
          })}
        </div>
      </div>
      <button onClick={handleDownloadImage}>Download Image</button>
    </div>
  );
};

export default EditorJsRenderer;
