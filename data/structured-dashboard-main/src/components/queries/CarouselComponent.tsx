import React, { useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Define the type for a single item
interface Item {
  id: string;
  query: string;
  answer: string;
}

// Props type
interface CarouselComponentProps {
  items: Item[];
}

const CarouselComponent: React.FC<CarouselComponentProps> = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    beforeChange: (current: number, next: number) => setCurrentIndex(next),
  };

  return (
    <div>
      <Slider {...settings}>
        {items.map((item: Item) => (
          <div key={item.id}>
            <p>{item.query}</p>
            <strong>{item.answer}</strong>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default CarouselComponent;
