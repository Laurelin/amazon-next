/* eslint-disable @next/next/no-img-element */
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';

export default function Banner() {
  return (
    <div className="relative">
      <div className="absolute w-full h-32 bg-gradient-to-t from-gray-100 to-transparent bottom-0 z-20" />
      <Carousel
        autoPlay
        infiniteLoop
        showStatus={false}
        showIndicators={false}
        showThumbs={false}
        interval={5000}
      >
        <div>
          <img
            loading="lazy"
            src="https://i.ibb.co/zn8jNDJ/Graham-Norton.jpg"
            alt="Listen. Read. Discuss. The Graham Norton book club on Audible"
          />
        </div>
        <div>
          <img
            loading="lazy"
            src="https://i.ibb.co/9qkzNtw/primevideo.jpg"
            alt="Prime Video included with Prime. Watch Now."
          />
        </div>
        <div>
          <img
            loading="lazy"
            src="https://i.ibb.co/PCLvq0g/amazonmusic.jpg"
            alt="Amazon Music, One Month Free"
          />
        </div>
      </Carousel>
    </div>
  );
}
