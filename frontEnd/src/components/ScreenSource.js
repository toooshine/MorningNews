import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Nav from './Nav';
import { List, Avatar } from 'antd';
import { Link } from 'react-router-dom';

import '../App.css';

function ScreenSource(props) {

    const APIKEY = process.env.REACT_APP_NEWS_API_KEY;

    const [sourceList, setSourceList] = useState([]);
    const [selectedLang, setSelectedLang] = useState(props.selectedLang);

    useEffect(() => {
        const findLang = async () => {

            const reqFind = await fetch(`/user-lang?token=${props.token}&lang=${props.selectedLang}`);
            const resultFind = await reqFind.json();
            setSelectedLang(resultFind.lang)
        }
        findLang()
    }, [])

    useEffect(() => {
        const APIResultsLoading = async () => {
            let langue = 'fr';
            let country = 'fr'
            if (selectedLang === 'en') {
                langue = 'en';
                country = 'us'
            }
            props.changeLang(selectedLang);
            const data = await fetch(`https://newsapi.org/v2/sources?language=${langue}&country=${country}&apiKey=${APIKEY}`);
            const body = await data.json();
            setSourceList(body.sources)
        }
        APIResultsLoading()
    }, [selectedLang])

    const changeLang = async lang => {

        setSelectedLang(lang);

        await fetch('/user-lang', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `lang=${lang}&token=${props.token}`
        });
    }

    return (
        <div>
            <Nav />
            <div className='Banner' style={{display:'flex',justifyContent:'center', alignItems:'center' }}>
                <img style={{ width: '40px', margin: '10px', cursor: 'pointer' }} src='/images/fr.png' onClick={()=> changeLang('fr')} alt='flag France' />
                <img style={{width:'40px', margin:'10px', cursor:'pointer'}} src='/images/en.png' onClick={()=> changeLang('en')} alt='flag United Kingdom' />
            </div>
            <div className='HomeThemes'>
                <List
                itemLayout="horizontal"
                dataSource={sourceList}
                renderItem={source => (
                <List.Item>
                    <List.Item.Meta
                    avatar={<Avatar src={`../images/${source.category}.png`} />}
                    title={<Link to={`/screensourcebyarticles/${source.id}`}>{source.name}</Link>}
                    description={source.description}
                    />
                </List.Item>
                )}
            />
            </div>
        </div>
    )
}

function mapStateToProps(state){
    return {
        token: state.token,
        selectedLang: state.selectedLang
    }
}

function mapDispatchToProps(dispatch) {
    return {
        changeLang: function (selectedLang) {
            dispatch({
                type: 'changeLang',
                selectedLang: selectedLang
            })
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ScreenSource);
