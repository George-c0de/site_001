import React, {useState} from 'react';

// Images
import pokeball from '../../../../Ảnh Pokemon Dự Trù/пакебол(1)-min.svg';

// Icons
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faChevronDown} from '@fortawesome/free-solid-svg-icons';

// Pages
import {PokeballsModal} from '../PokeballsModal/PokeballsModal';

import './PokeballsPack.css';

const COLORS_TO_CLASS = {
    bronze: 'text-pokeball-1',
    silver: 'text-pokeball-2',
    gold: 'text-pokeball-3',
    emerald: 'text-pokeball-4'
}

export const PokeballsPack = ({title, amount, images, background, card_data,price,six}) => {
    const [modalOpen, setModalOpen] = useState(false);
    const handlePokeballsPack = () => {
        setModalOpen(!modalOpen);
    }

    return (
        <div className="col-sm" id="title-pack-pokeballs">
            <span>Cards</span>
            <div onClick={handlePokeballsPack} className={modalOpen ? "pokeballs-container open" : "pokeballs-container"}>
                <div id="pokeballs-detail">
                    <img src={pokeball} className="small-pokeball" alt=""/>
                    <img src={pokeball} className="small-pokeball" alt=""/>
                    <img src={pokeball} className="small-pokeball" alt=""/>
                    <img src={pokeball} className="small-pokeball" alt=""/>
                    <img src={pokeball} className="small-pokeball" alt=""/>
                    <img src={pokeball} className="small-pokeball" alt=""/>
                </div>
                <div className={COLORS_TO_CLASS[title.toLowerCase()] || 'text-pokeball-dedfault'}>{title}</div>
                <div className="icon-showdown-container" onClick={handlePokeballsPack}>
                    <FontAwesomeIcon
                        icon={faChevronDown}
                        className="icon-showdown"
                    />
                </div>

                <PokeballsModal background={background}
                                amount={amount}
                                images={images}
                                category={title?.toLowerCase()}
                                card_data={card_data}
                                price = {price}
                                six = {six}
                />
            </div>
        </div>
    )
}