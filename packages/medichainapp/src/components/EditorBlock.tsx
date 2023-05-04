//./components/Editor
import React, { memo, useEffect, useRef } from "react";
import EditorJS, { OutputData } from "@editorjs/editorjs";

import Code from "@editorjs/code";
import Header from "@editorjs/header";
import Paragraph from "@editorjs/paragraph";

export const EDITOR_TOOLS = {
  code: Code,
  header: Header,
  paragraph: Paragraph
};

//props
type Props = {
  data?: OutputData;
  onChange(val: OutputData): void;
  holder: string;
};

const EditorBlock = ({ data, onChange, holder }: Props) => {
  //add a reference to editor
  const ref = useRef<EditorJS>();

  //initialize editorjs
  useEffect(() => {
    //initialize editor if we don't have a reference
    if (!ref.current) {
      const editor = new EditorJS({
        holder: holder,
        tools: EDITOR_TOOLS,
        data: {
          time: 1552744582955,
          blocks: [
            {
              type: "paragraph",
              data: {
                text: "Name: "
              }
            },
            {
              type: "paragraph",
              data: {
                text: "DOB: "
              }
            },
            {
              type: "paragraph",
              data: {
                text: "Family History: "
              }
            },
            {
              type: "paragraph",
              data: {
                text: "Diagnosis: "
              }
            }
          ],
          version: "2.11.10"
        },
        async onChange(api, event) {
          const data = await api.saver.save();
          onChange(data);
        },
      });
      ref.current = editor;
    }

    //add a return function handle cleanup
    return () => {
      if (ref.current && ref.current.destroy) {
        ref.current.destroy();
      }
    };
  }, []);


  return <div id={holder} className="prose max-w-full" />;
};

export default memo(EditorBlock);
