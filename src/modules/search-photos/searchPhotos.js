import React, {useEffect, useState} from "react";
import { useHistory } from 'react-router-dom';
import {createApi} from "unsplash-js";
import CardList from "../../components/card-list/cardList";

const MAIN_PHOTO = 'https://images.unsplash.com/photo-1631641551473-fbe46919289d?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1170&q=80';
const CATEGORIES = ['cat', 'dog', 'car', 'nature', 'day', 'night', 'sun', 'dark'];

const api = createApi({
    accessKey: "Ow9TX0gDo_Z_8nGxoP5jFNGqntD81htfX6ovh9vK858",
});

export default function SearchPhotos() {
    const history = useHistory();
    const [pics, setPics] = useState([]);

        useEffect(() => {
        if (!localStorage.getItem('likes')) {
            localStorage.setItem('likes', '');
        }
    });

    useEffect(() => {
        api.photos
            .list({perPage: 50})
            .then(photos => {
                const { results } = photos.response;
                results && setPics(results);
            })
            .catch(() => {
                console.log("something went wrong!");
            });
    }, []);

    return (
        <>
            <div
                className="header"
                style={{
                    background: `linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ), url(${MAIN_PHOTO})`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat'
                }}>
                <div className="header-inner">
                    <h1 className="header-title">Technical task <br/>Photo Gallery</h1>
                    <form
                        className="form"
                        name="form"
                        onSubmit={(e) => {
                            const q = e.target['query-input'].value;
                            e.preventDefault();
                            if (q !== '') {
                                localStorage.setItem('query', e.target['query-input'].value);
                                history.push(`/search/` + e.target['query-input'].value)
                            }
                        }}
                    >
                        <button
                            type="submit"
                            className="search-button"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                 className="search-icon" viewBox="0 0 16 16">
                                <path
                                    d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                            </svg>
                        </button>
                        <input
                            name="query-input"
                            type="text"
                            className="input"
                            placeholder="Search something..."
                            required
                        />
                    </form>
                </div>
            </div>
            <div className="body">
                <div className="categories">
                    {CATEGORIES.map((item) => {
                        return (
                            <div
                                className="category"
                                style={{
                                    background: `url('/assets/${item}.jpg')`,
                                    backgroundPosition: 'center',
                                    backgroundSize: 'cover',
                                    backgroundRepeat: 'no-repeat',
                                }}
                                onClick={() => {
                                    localStorage.setItem('query', item);
                                    history.push(`/search/` + item)
                                }}

                            >
                                {item.includes('sun')
                                    ? <span className="category-name" id={`category-name-${item}`} style={{
                                        color:  '#111'
                                    }}>
                                        {item.charAt(0).toUpperCase() + item.slice(1)}
                                        </span>
                                    : <span className="category-name" id={`category-name-${item}`} style={{
                                        color:  '#fff'
                                    }}>
                                        {item.charAt(0).toUpperCase() + item.slice(1)}
                                        </span>
                                }

                            </div>
                        );
                    })}

                </div>
                {!pics.length &&
                <no-data>
                    No Data
                </no-data>}
                {!!pics.length &&
                <CardList
                    pics={pics}
                />
                }
            </div>
        </>
    );
}