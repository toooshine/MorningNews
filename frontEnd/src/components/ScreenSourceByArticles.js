import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Card, Modal } from 'antd';
import { LikeOutlined, ReadOutlined } from '@ant-design/icons';
import Nav from './Nav';

const { Meta } = Card;

function ScreenSourceByArticles(props) {

    const [articleList, setArticleList] = useState([]);
    const [visible, setVisible] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
        const findArticles = async () => {
            const data = await fetch(`https://newsapi.org/v2/top-headlines?sources=${props.match.params.id}&apiKey=5fd371b1d74e40eeb449788705dd67cb`);
            const body = await data.json();
            setArticleList(body.articles);
        }
        findArticles();
    }, []);

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

    const saveArticle = async article => {
        props.addToWishlist(article);
        await fetch('/wishlist-article', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `name=${article.title}&content=${article.content}&desc=${article.description}&lang=${props.selectedLang}&img=${article.urlToImage}&token=${props.token}`
        });
    }

    const formatTxt = article => {
        if (article) {
            const txt = article.split('');
            let result = [];
            for (let i = 0; i < 90; i++){
                result.push(txt[i])
            }
            result.push(' ...')
            return result;
        } else {
            return article
        }
        
    } 

    const articles =
        articleList && articleList.map((article, i) =>
            <div key={i} style={{ display: 'flex', justifyContent: 'center' }}> 
                    <Card
                        style={{ width: 300, display: 'flex', justifyContent: 'space-between', flexDirection: 'column', margin: '15px' }}
                        cover={
                            <img
                                style={{height:'178px'}}
                                alt="example"
                                src={article.urlToImage}
                            />
                        }
                        actions={[
                            <ReadOutlined type="read" key="ellipsis2" onClick={() => showModal(article.title, article.content)} />,
                            <LikeOutlined type="like" key="ellipsis" onClick={() => saveArticle(article)} />
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

    return (
        <div>
            <Nav />
            <div className='Card' style={{display:'flex', justifyContent:'center', flexWrap:'wrap'}}>
                    {articles}
            </div>
        </div>
    )
}

function mapDispatchToProps(dispatch) {
        return {
            addToWishlist: function (article) {
                dispatch({
                    type: 'addToWishlist',
                    articleLiked: article
                })
            }
        }
    }

function mapStateToProps(state) {
    return {
        token: state.token,
        selectedLang: state.selectedLang
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ScreenSourceByArticles);
