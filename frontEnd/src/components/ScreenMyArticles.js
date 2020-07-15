import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Card, Modal } from 'antd';
import { DeleteOutlined, ReadOutlined } from '@ant-design/icons';
import Nav from './Nav';

const { Meta } = Card;

function ScreenMyArticles(props) {

    const [visible, setVisible] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [langFiltre, setLangFiltre] = useState('');

    useEffect(() => {
        const findArticlesWhishList = async () => {
            const dataWishList = await fetch(`/wishlist-article?token=${props.token}&lang=${langFiltre}`);
            const body = await dataWishList.json();
            props.saveArticles(body.articles)
        }
        findArticlesWhishList();
    }, [langFiltre])

    const deleteArticle = async (title) => {
        props.deleteToWishList(title);

        await fetch('/wishlist-article', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `token=${props.token}&title=${title}`
        }) 
    }

    const showModal = (title, content) => {
        setVisible(true);
        setTitle(title);
        setContent(content);
    };

    const handleOk = e => {
        setVisible(false)
    };

    const handleCancel = e => {
        setVisible(false)
    };

    const formatTxt = article => {
        const txt = article.split('');
        let result = [];
        for (let i = 0; i < 90; i++){
            result.push(txt[i])
        }
        result.push(' ...')
        return result;
    } 

    const filtreLang = lang => {
        setLangFiltre(lang)
    }

    const articles =
        props.myArticles.map((article, i) =>
            <div key={i} style={{ display: 'flex', justifyContent: 'center' }}>

                    <Card
                        style={{ width: 300, display: 'flex', justifyContent: 'space-between', flexDirection: 'column', margin: '15px' }}
                        cover={
                            <img
                                style={{height: '178px'}}
                                alt="example"
                                src={article.urlToImage}
                            />
                        }
                        actions={[
                            <ReadOutlined type="read" key="ellipsis2" onClick={() => showModal(article.title, article.content)} />,
                            <DeleteOutlined type="delete" key="ellipsis" onClick={() => deleteArticle(article.title)} />
                        ]}
                    >
                        <Meta
                            title={article.title}
                            description={formatTxt(article.description)}
                        />
                        </Card>

                <Modal
                    title={title}
                    visible={visible}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    >
                    <p>{content}</p>
                </Modal>
            </div>
        );

    const noArticles = props.myArticles.length === 0 && <p style={{ marginTop: '30px', textAlign: 'center' }}>No Articles</p>;

    return (
        <div>
            <Nav />
            <div className='Banner' style={{display:'flex',justifyContent:'center', alignItems:'center' }}>
                <img style={{ width: '40px', margin: '10px', cursor: 'pointer' }} src='/images/fr.png' onClick={()=> filtreLang('fr')} alt='flag France' />
                <img style={{width:'40px', margin:'10px', cursor:'pointer'}} src='/images/en.png' onClick={()=> filtreLang('en')} alt='flag United Kingdom' />
            </div>
            <div className='Card' style={{display:'flex', justifyContent:'center', flexWrap:'wrap'}}>
                {noArticles}
                {articles}
            </div>
        </div>
    )
};

function mapStateToProps(state) {
    return {
        myArticles: state.whisList,
        token: state.token
    }
}

function mapDispatchToProps(dispatch) {
    return {
        deleteToWishList: function(articleTitle) {
            dispatch({
                type: 'deleteArticle',
                title: articleTitle
            });
        },
        saveArticles: function(articles) {
            dispatch({
                type: 'saveArticles',
                articles: articles
            });
        }
    }
}

    export default connect(
        mapStateToProps,
        mapDispatchToProps
    )(ScreenMyArticles);
