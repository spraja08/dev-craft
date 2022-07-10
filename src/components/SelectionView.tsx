/*
*  Copyright (C) 1998-2022 by Northwoods Software Corporation. All Rights Reserved.
*/

import React, { useState } from 'react'

import './Inspector.css';

function request<TResponse>(
    url: string
): Promise<TResponse> {
    alert( url );
    return fetch(url, { mode: 'no-cors'})
        .then((response) => response.json())
        .then((data) => data as TResponse);
}


export const SelectionView = (selectedData: any) => {
    const [metaData, setMetaData] = useState<string>("");
    const node = selectedData["selectedData"]["text"];
    const fileName = "https://github.com/spraja08/dev-craft/blob/master/docs/" + node + ".md"

    request<string>(fileName).then(content => {
        alert( content );
        setMetaData(content);
    })

    return (
        <div id='myInspectorDiv' className='inspector'>
            {metaData}
        </div>
    );
};
