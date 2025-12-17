import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination, EffectFade } from 'swiper/modules';
import { carouselService } from '../../services/carousel-service';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import './style.css';

// Imágenes de placeholder para perros y gatos
const DEFAULT_IMAGES = [
  {
    id: 1,
    imagenUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=1200&q=80',
    title: 'Productos para Perros',
    description: 'Todo lo que tu perro necesita',
  },
  {
    id: 2,
    imagenUrl: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=1200&q=80',
    title: 'Productos para Gatos',
    description: 'Cuida a tu felino con amor',
  },
  {
    id: 3,
    imagenUrl: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=1200&q=80',
    title: 'Alimentos Premium',
    description: 'Nutrición de calidad para tu mascota',
  },
  {
    id: 4,
    imagenUrl: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=1200&q=80',
    title: 'Accesorios y Juguetes',
    description: 'Diversión y confort garantizados',
  },
];

const SwiperCarousel = ({ images = [], height, showOverlay = true }) => {
  const [carouselImages, setCarouselImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Si se pasan imágenes como prop, usarlas directamente
    if (Array.isArray(images) && images.length > 0) {
      console.log('Using images from props:', images);
      const formattedImages = images.map(img => ({
        id: img.id,
        imagenUrl: img.imagenUrl || img.imagen_url,
        enlaceUrl: img.enlaceUrl || img.link_url || null,
        title: img.title || null,
        description: img.description || null,
      }));
      console.log('Formatted images:', formattedImages);
      setCarouselImages(formattedImages);
      setLoading(false);
      return;
    }

    // Si no hay imágenes como prop, cargarlas del backend
    const fetchCarouselImages = async () => {
      try {
        console.log('Fetching carousel images from backend...');
        const data = await carouselService.getCarouselPublic();
        console.log('Received data from backend:', data);
        if (Array.isArray(data) && data.length > 0) {
          // Convertir las imágenes del backend al formato esperado
          const formattedImages = data
            .sort((a, b) => (a.orden || 0) - (b.orden || 0))
            .map(img => {
              console.log('Processing image:', img);
              return {
                id: img.id,
                imagenUrl: typeof img.imagen_url === 'string' && img.imagen_url
                  ? (img.imagen_url.startsWith('http') 
                      ? img.imagen_url 
                      : `http://localhost:8000${img.imagen_url}`)
                  : null,
                enlaceUrl: img.link_url || null,
                title: null,
                description: null,
              };
            })
            .filter(img => img.imagenUrl);
          
          console.log('Final formatted images:', formattedImages);
          
          if (formattedImages.length > 0) {
            setCarouselImages(formattedImages);
          } else {
            console.log('No valid images, using defaults');
            setCarouselImages(DEFAULT_IMAGES);
          }
        } else {
          console.log('No data from backend, using defaults');
          setCarouselImages(DEFAULT_IMAGES);
        }
      } catch (error) {
        console.error('Error fetching carousel images:', error);
        console.log('Usando imágenes predeterminadas del carrusel');
        setCarouselImages(DEFAULT_IMAGES);
      } finally {
        setLoading(false);
      }
    };

    fetchCarouselImages();
  }, [images]);

  if (loading) {
    return (
      <div className="modern-carousel-wrapper">
        <div className="carousel-loading">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="modern-carousel-wrapper">
      <Swiper
        className="swiper-carousel-container"
        modules={[Autoplay, Navigation, Pagination, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        loop={carouselImages.length > 1}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        navigation
        pagination={{ 
          clickable: true,
          dynamicBullets: true,
        }}
        speed={800}
        style={height ? { width: '100%', height } : undefined}
      >
        {carouselImages.map((item, idx) => (
          <SwiperSlide key={item.id || idx}>
            <div className="carousel-slide-wrapper">
              {item.enlaceUrl ? (
                <a href={item.enlaceUrl} className="carousel-link" aria-label={item.title || `Promoción ${idx + 1}`}>
                  <img
                    src={item.imagenUrl}
                    alt={item.title || `Promoción ${idx + 1}`}
                    className="carousel-image"
                    loading={idx === 0 ? 'eager' : 'lazy'}
                  />
                  {showOverlay && (item.title || item.description) && (
                    <div className="carousel-overlay">
                      <div className="carousel-content">
                        {item.title && <h3 className="carousel-title">{item.title}</h3>}
                        {item.description && <p className="carousel-description">{item.description}</p>}
                        <div className="carousel-cta">
                          <span className="cta-text">Ver más</span>
                          <svg className="cta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  )}
                </a>
              ) : (
                <>
                  <img
                    src={item.imagenUrl}
                    alt={item.title || `Promoción ${idx + 1}`}
                    className="carousel-image"
                    loading={idx === 0 ? 'eager' : 'lazy'}
                  />
                  {showOverlay && (item.title || item.description) && (
                    <div className="carousel-overlay">
                      <div className="carousel-content">
                        {item.title && <h3 className="carousel-title">{item.title}</h3>}
                        {item.description && <p className="carousel-description">{item.description}</p>}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      
      {/* Decorative elements */}
      <div className="carousel-decoration carousel-decoration-left"></div>
      <div className="carousel-decoration carousel-decoration-right"></div>
    </div>
  );
};

export default SwiperCarousel;
