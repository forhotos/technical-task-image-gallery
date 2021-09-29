import React, {useRef, useEffect, useState} from "react";
import {createApi} from "unsplash-js";
import CardList from "../../components/card-list/cardList";

const api = createApi({
    accessKey: "Ow9TX0gDo_Z_8nGxoP5jFNGqntD81htfX6ovh9vK858",
});

export default function SearchResults() {
    const loader = useRef(null);
    const query = localStorage.getItem('query');
    const [pics, setPics] = useState([]);
    const [page, setPage] = useState(1);

    const handleObserver = (entities) => {
        const target = entities[0];
        if (target.isIntersecting) {
            setPage((page) => page + 1)
        }
    };

    useEffect(() => {
        if (!localStorage.getItem('likes')) {
            localStorage.setItem('likes', '');
        }
    });

    useEffect(() => {
        // initialize IntersectionObserver
        // and attaching to Load More div
        const observer = new IntersectionObserver(handleObserver, null);
        if (loader.current) {
            observer.observe(loader.current)
        }
    }, []);

    useEffect(() => {
        let args = page > 1 ? { query: query, perPage: 20, page: page } : { query: query };
        query !== ''  && api.search
            .getPhotos(args)
            .then(photos => {
                const { results } = photos.response;
                results && page > 1
                ? setPics((p) => p.concat(results))
                : setPics(results);
            })
    }, [page, query]);

    return (
        <>
            <div className="container-results">
                <div className="header-results">
                    <h2 className="title-results">
                        {query.charAt(0).toUpperCase() + query.slice(1)}
                    </h2>
                    <span className="subtitle-results">
                        Results for {query}
                    </span>
                </div>
                {!pics.length && <div className="no-data">Loading...</div>}
                {!!pics.length &&
                <CardList
                    pics={pics}
                />
                }
                <div className="loading" ref={loader}>
                </div>
            </div>
        </>
    );
}
