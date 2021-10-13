import axios from "axios";
import React from "react";
import { Fragment, useEffect, useState } from "react";
import { IForm, TentacledChild } from "./IForm";
import "./form.css";

function App() {
  const service = axios.create({
    baseURL: "https://www.jsonbulut.com/json/",
    timeout: 15000,
  });
  const ref = "d855bcdbe683b4f1537ab4336451812e";
  function formResult() {
    const prm = {
      ref: ref,
      formId: 26,
    };
    return service.get("forms.php", { params: prm });
  }
  const [formHtml, setFormHtml] = useState<TentacledChild[]>([]);

  const [htmlDiv, setHtmlDiv] = useState<[]>([]);

  useEffect(() => {
    formResult().then((res) => {
      const forms: IForm = res.data;
      const datas =
        forms.forms[0].bilgiler.formjson.children[0].children[0].children[0]
          .children;
      // const dataxx=forms.forms[0].bilgiler.formjson
      //console.log("dataxx",dataxx);
      setFormHtml(datas);
    });
    let arrHtml: any = [];

    formHtml.map((item: any, index: any) => {
      arrHtml.push(item);
      if (item.tag !== "legend") {
        item.children.map((item: any, index: any) => {
          // console.log(item);
          arrHtml.push(item);
          if (item.tag === "div") {
            // console.log(item.children);
            item.children.map((item: any, index: any) => {
              arrHtml.push(item);
              // console.log(item);
              if (item.tag === "label" || item.tag === "select") {
                item.children.map((item: any, index: any) => {
                  arrHtml.push(item);
                });
              }
              setHtmlDiv(arrHtml);
            });
          }
        });
      }
    });
  }, [formHtml]);

  // console.log(`htmlarray`,htmlDiv);
  const [change, setChange] = useState<any>({});

  function fncOnChange(e: any) {
    setChange({ ...change, [e.target.name]: e.target.value });
    // console.log(`data`,change);
  }
  function fncSubmit(e: any) {
    e.preventDefault();
    console.log(change);
  }
  return (
    <>
      <form onSubmit={(e) => fncSubmit(e)}>
        {htmlDiv &&
          htmlDiv.map((item: any, index: any) => {
            if (item.tag === "select") {
              return (
                <Fragment key={index}>
                  {React.createElement(
                    item.tag,
                    {
                      className: item.class,
                      id: item.id,
                      name: item.name,
                      type: item.type,
                      placeholder: item.placeholder,
                      htmlFor: item.for,
                      value: item.value,
                      onChange: fncOnChange,
                    },
                    item.children.map((item: any, index: any) => {
                      return React.createElement(
                        item.tag,
                        { html: item.html, key: index },
                        item.html
                      );
                    })
                  )}
                </Fragment>
              );
            } else {
              if (item.tag !== "option") {
                return React.createElement(
                  item.tag,
                  {
                    className: item.class,
                    key: index,
                    id: item.id,
                    name: item.name,
                    type: item.type,
                    placeholder: item.placeholder,
                    htmlFor: item.for,
                    value: item.value,
                    onChange: fncOnChange,
                  },
                  item.html
                );
              }
            }
          })}
      </form>
    </>
  );
}

export default App;
