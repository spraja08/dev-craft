import React, { useState } from 'react'
import MuiMarkdown from 'mui-markdown';

import './Inspector.css';

  
function request<TResponse>(url: string): Promise<TResponse> {
    return fetch(url)
        .then((response) => response.json())
        .then((data) => data as TResponse);
}


export const SelectionView = (selectedData: any) => {
    const [metaData, setMetaData] = useState<string>("");
    const node = selectedData["selectedData"]["text"];
    const url = "http://127.0.0.1:5000/metadata/" + node;

    request<string>(url).then(content => {
        const jsonval = JSON.parse(content)
        setMetaData(jsonval.result);
    })

    return (
        <div id='myInspectorDiv' className='inspector'>
            <MuiMarkdown>{metaData}</MuiMarkdown>
        </div>
    );
};