import React from 'react';
import './Carousel.scss';

export interface ICarouselProps {
    items: string[];
    selectedItem: string;
    onChange: (item: string) => void;
}

const Carousel = (props: ICarouselProps) => {
    const {
        items,
        selectedItem,
        onChange
    } = props;

    const lastItemIndex = items.indexOf(selectedItem) - 1;
    
    let lastItem: string | null = null;
    if (lastItemIndex >= 0) {
        lastItem = items[lastItemIndex];
    }

    const nextItemIndex = items.indexOf(selectedItem) + 1;

    let nextItem: string | null = null;
    if (nextItemIndex < items.length) {
        nextItem = items[nextItemIndex];
    }

    return (
        <div className="carousel">
            { lastItem ? <button className="carousel-item" onClick={() => onChange(lastItem as string)}>{`< ${lastItem}`}</button> : <span></span> }
            { nextItem && <button className="carousel-item" onClick={() => onChange(nextItem as string)}>{`${nextItem} >`}</button> }
        </div>
    )
}

export default React.memo(Carousel);