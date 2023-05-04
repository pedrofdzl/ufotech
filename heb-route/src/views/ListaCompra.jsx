import React, { useContext, useEffect, useState } from "react";
import { useParams } from 'react-router-dom';

import HeaderNavitagion from "../navigators/HeaderNavigation";


import { ListContext } from "../providers/ListProvider";

const ListaCompra = () =>{
    const { listID } = useParams();
    const { lists } = useContext(ListContext)

    const [list, setList] = useState({});

    useEffect(()=>{
        setList(lists.myLists[listID]);
    }, [lists])

    return <>
        <HeaderNavitagion params={{'tab': 'Lists'}} />
        <h1>{list.name}</h1>
        <small>Owner: {list.owner}</small>
        <small>Creado: {list.createdDate.getDate()}-{list.createdDate.getMonth()+1}-{list.createdDate.getFullYear()}</small>
    </>
};


export default ListaCompra;