import { useEffect, useState } from 'react';
import './SearchBar.css';
import Transcription from '../Transcription/Transcription';

export default function SearchBar({ placeholder, onChange, tabindex }) {
    const [searchText, setSearchText] = useState('');

    useEffect(()=>{
        if(onChange) onChange(searchText);
    },[searchText]);

    const onChangeST = evt => {
        setSearchText(evt.target.value);
    }

    return (
        <>
            <div className="searchbar-container">
                <div className="searchbar-icon"></div>
                <input
                    type="search"
                    className="searchbar"
                    placeholder={placeholder}
                    value={searchText}
                    onChange={onChangeST}
                    tabIndex={tabindex || 1}
                />
                <Transcription
                    tabindex={tabindex || 1}
                    ariaLabel="voice search"
                    onResult={(result) => setSearchText(result)}
                />
            </div>
        </>
    );
}