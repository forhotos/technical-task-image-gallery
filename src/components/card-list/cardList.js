import React, {useCallback, useEffect, useState} from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import {DropdownButton, Dropdown} from "react-bootstrap";

export default function CardList(props) {
    const {pics} = props;
    const [storageLikes, setStorageLikes] = useState(localStorage.getItem('likes').split(','));
    const [modalPhoto, setModalPhoto] = useState(null);
    const [show, setShow] = useState(false);

    useEffect(() => {
        window.addEventListener('storage', () => {
            const likes = localStorage.getItem('likes').split(',');
            setStorageLikes(likes);
        })
    }, []);

    const hitLike = useCallback((id) => {
        const newLikes = storageLikes;
        if (storageLikes.includes(id)) {
            const index = storageLikes.indexOf(id);
            newLikes.splice(index, 1);
            setStorageLikes(newLikes);
            document.getElementById(`button-like-${id}`).id=`button-view-${id}`;
            document.getElementById(`heart-icon-like-${id}`).id=`heart-icon-${id}`;
            if (document.getElementById(`button-like-modal`)) {
                document.getElementById(`button-like-modal`).id = `button-view-modal`;
                document.getElementById(`heart-icon-like-modal`).id = `heart-icon-modal`;
            }
        } else {
            newLikes.push(id);
            setStorageLikes(newLikes);
            document.getElementById(`button-view-${id}`).id=`button-like-${id}`;
            document.getElementById(`heart-icon-${id}`).id=`heart-icon-like-${id}`;
            if (document.getElementById(`button-view-modal`)) {
                document.getElementById(`button-view-modal`).id=`button-like-modal`;
                document.getElementById(`heart-icon-modal`).id=`heart-icon-like-modal`
            }
        }
        localStorage.setItem('likes', storageLikes.join(','));
    }, [storageLikes]);

    const downloadImage = useCallback((url, title) => {
        axios({
            url: url,
            method: 'GET',
            responseType: 'blob'
        })
            .then((response)=> {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', title + '.jpg'); //or any other extension
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            })
    }, []);

    return (
        <div className="card-list">
            {pics.map((pic) => {
                return <div
                    className="card"
                    key={pic.id}
                    onClick={() => {
                        setModalPhoto(
                            {
                                id: pic.id,
                                title: pic.alt_description
                                    ? pic.alt_description.charAt(0).toUpperCase() + pic.alt_description.slice(1)
                                    : 'There could be a title',
                                img:
                                    <img className="photo-view-image"
                                         alt={pic.alt_description}
                                         src={pic.urls.regular}
                                    />,
                                download: pic.urls.full,
                                share: pic.links.html
                            }
                        );
                        setShow(true);
                    }}
                    style={{
                        backgroundImage: `url(${pic.urls.regular})`,
                        backgroundPosition: 'center',
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat'
                    }}
                >
                    <div className="card-list-part" style={{flex: '90%'}}>
                        <button
                            type="button"
                            className="card-button-like"
                            id={
                                storageLikes.includes(pic.id)
                                    ? `button-like-${pic.id}`
                                    : `button-view-${pic.id}`
                            }
                            onClick={(event) => {
                                hitLike(pic.id);
                                event.stopPropagation();
                            }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                id={
                                    storageLikes.includes(pic.id)
                                        ? `heart-icon-like-${pic.id}`
                                        : `heart-icon-${pic.id}`
                                }
                                viewBox="0 0 16 16"
                            >
                                <path
                                    d="M4 1c2.21 0 4 1.755 4 3.92C8 2.755 9.79 1 12 1s4 1.755 4 3.92c0 3.263-3.234 4.414-7.608 9.608a.513.513 0 0 1-.784 0C3.234 9.334 0 8.183 0 4.92 0 2.755 1.79 1 4 1z"/>
                            </svg>
                        </button>
                    </div>
                    <div className="card-list-part">
                        <button
                            type="button"
                            id={`button-view-download-${pic.id}`}
                            className="card-button-download"
                            onClick={(event) => {
                                const url = pic.urls.full;
                                const title = pic.alt_description
                                    ? pic.alt_description.charAt(0).toUpperCase() + pic.alt_description.slice(1)
                                    : 'There could be a title';
                                downloadImage(url, title);
                                event.stopPropagation();
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                                 className="bi bi-download" viewBox="0 0 16 16">
                                <path
                                    d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                                <path
                                    d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
                            </svg>
                        </button>
                    </div>
                </div>
            })}
            {modalPhoto &&
            <Modal
                show={show}
                onHide={() => setShow(false)}
                onExiting={() => setModalPhoto(null)}
                size="xl"
            >
                <Modal.Header>
                    <div className="modal-header-title">
                        {modalPhoto.title}
                    </div>
                    <div className="modal-header-toolbar">
                        <button
                            type="button"
                            id={
                                storageLikes.includes(modalPhoto.id)
                                    ? `button-like-modal`
                                    : `button-view-modal`
                            }
                            onClick={() => hitLike(modalPhoto.id)}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                id={
                                    storageLikes.includes(modalPhoto.id)
                                        ? `heart-icon-like-modal`
                                        : `heart-icon-modal`
                                }
                                viewBox="0 0 16 16"
                            >
                                <path
                                    d="M4 1c2.21 0 4 1.755 4 3.92C8 2.755 9.79 1 12 1s4 1.755 4 3.92c0 3.263-3.234 4.414-7.608 9.608a.513.513 0 0 1-.784 0C3.234 9.334 0 8.183 0 4.92 0 2.755 1.79 1 4 1z"/>
                            </svg>
                        </button>
                        <button
                            type="button"
                            id="button-view-download-modal"
                            onClick={() => {
                                const { download, title}  = modalPhoto;
                                downloadImage(download, title);
                            }}
                        >
                            Download
                        </button>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    {modalPhoto.img}
                </Modal.Body>
                <Modal.Footer>
                    <DropdownButton
                        variant="outline-secondary"
                        align="start"
                        id="button-view-share-modal"
                        onClick={() => setShare(true)}
                        title={
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor"
                                     className="share-button-icon" viewBox="0 0 16 16">
                                    <path
                                        d="M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5z"/>
                                </svg>
                                Share
                            </>
                        }
                        drop="up"
                    >
                        <Dropdown.Item
                            eventKey="1"
                            className="share-item"
                            onClick={() => {
                                const text = encodeURIComponent("What a beautiful picture!");
                                const hash_tags = "Beautiful,Photo,Picture,Gallery";
                                const shareUrl = `https://twitter.com/intent/tweet?url=${modalPhoto.share}&text=${text}&hashtags=${hash_tags}`;
                                window.open(shareUrl,"_blank" ).focus();
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="rgb(29, 155, 240)"
                                 className="share-item-icon" viewBox="0 0 16 16">
                                <path
                                    d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
                            </svg>
                            <span className="share-item-label">
                                Twitter
                            </span>
                        </Dropdown.Item>
                        <Dropdown.Item
                            eventKey="2"
                            className="share-item"
                            onClick={() => {
                                const shareUrl = `http://www.facebook.com/sharer/sharer.php?u=${modalPhoto.share}`;
                                window.open(shareUrl,"_blank" ).focus();
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#365899"
                                 className="share-item-icon" viewBox="0 0 16 16">
                                <path
                                    d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
                            </svg>
                            <span className="share-item-label">
                                Facebook
                            </span>
                        </Dropdown.Item>
                    </DropdownButton>
                </Modal.Footer>
            </Modal>
            }
        </div>

    );
}