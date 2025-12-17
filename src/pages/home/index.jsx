import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { productosService } from '../../services/productos-service';
import { carouselService } from '../../services/carousel-service';
import { useCart } from '../../hooks/use-cart';
import { useContext } from 'react';
import CartContext from '../../modules/cart/context/CartContext';
import { ProductCard, Loader } from '../../components/ui';
import Hero from '../../components/hero/Hero';
import FeaturedSection from '../../components/featured/FeaturedSection';
import SwiperCarousel from '../../components/carousel/SwiperCarousel';
import CategoryFilters from '../../components/category-filters/CategoryFilters';
import { toast } from '../../utils/toast';
import './style.css';



const CategorySection = ({ categoryName, subcategories, onAddToCart, visibleCounts = {}, onLoadMoreSubcategory }) => {
  if (!subcategories || Object.keys(subcategories).length === 0) {
    return null;
  }

  return (
    <section className="category-section" aria-labelledby={`category-${categoryName}`}>
      <h2 id={`category-${categoryName}`} className="category-section-title">
        {categoryName}
      </h2>
      {Object.entries(subcategories).map(([subcategoryName, products]) => {
        if (!products || products.length === 0) return null;
        const key = `${categoryName}||${subcategoryName}`;
        const visible = visibleCounts[key] ?? 3;
        const shown = (products || []).slice(0, visible);
        return (
          <div key={subcategoryName} className="subcategory-section">
            <h3 className="subcategory-title">{subcategoryName}</h3>
            <div className="products-grid">
              {shown.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={onAddToCart}
                />
              ))}
            </div>
            {products.length > visible && (
              <div style={{ textAlign: 'center', marginTop: 8 }}>
                <button className="btn" onClick={() => onLoadMoreSubcategory && onLoadMoreSubcategory(categoryName, subcategoryName)}>Ver más</button>
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
};

export const HomePage = () => {
  const dispatch = useDispatch();
  const { catalog } = useSelector((state) => state.productos);
  const carousel = useSelector((state) => state.carousel);
  const [isLoading, setIsLoading] = useState(true);
  const [skip, setSkip] = useState(0);
  const [limit] = useState(20);
  const [hasMore, setHasMore] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [activeFilter, setActiveFilter] = useState(null);
  const [filteredCatalog, setFilteredCatalog] = useState({});
  const [minLoading, setMinLoading] = useState(false);
  const [globalDisplayCount, setGlobalDisplayCount] = useState(6);
  const [subVisible, setSubVisible] = useState({});
  const [filteredDisplayCount, setFilteredDisplayCount] = useState(3);
  
  // Call both hooks unconditionally; prefer new CartContext when available
  const legacyCart = useCart();
  const ctx = useContext(CartContext);
  const addToCartHandler = (product, qty = 1) => {
    if (ctx && ctx.addItem) return ctx.addItem(product, qty);
    return legacyCart.addToCart(product, qty);
  };

  useEffect(() => {
    // initial load + ensure loader visible ~2s
    setMinLoading(true);
    const t = setTimeout(() => setMinLoading(false), 2000);
    loadCatalog({ skip: 0, append: false });
    loadCarousel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    // Apply filter when activeFilter or catalog changes
    if (!activeFilter) {
      setFilteredCatalog(catalog);
      // reset global pagination when showing all
      setGlobalDisplayCount(6);
      setSubVisible({});
    } else {
      filterCatalogByCategory(activeFilter);
      // when filtering to a category, initialize filtered list pagination
      setFilteredDisplayCount(3);
      setSubVisible({});
    }
  }, [activeFilter, catalog]);

  const loadCatalog = async ({ skip = 0, append = false } = {}) => {
    try {
      setLoadError(false);
      setIsLoading(true);
      const data = await productosService.getCatalogPublic({ skip, limit });

      // If backend returns an array of products, transform it into the
      // expected catalog shape: { categoryName: { subcategoryName: [products] } }
      let catalogPayload = data;
      if (Array.isArray(data)) {
        catalogPayload = data.reduce((acc, prod) => {
          const catName = prod.categoria?.nombre || 'Sin categoría';
          const subName = prod.subcategoria?.nombre || 'General';
          if (!acc[catName]) acc[catName] = {};
          if (!acc[catName][subName]) acc[catName][subName] = [];

          // Normalize product fields expected by ProductCard
          const imagenFromArray = Array.isArray(prod.imagenes) && prod.imagenes.length > 0
            ? prod.imagenes[0]?.imagen_url || prod.imagenes[0]?.url || null
            : null;
          const possibleImage = prod.imagen_url ?? prod.imagenUrl ?? imagenFromArray ?? null;
          const imagenUrl = possibleImage ? (typeof possibleImage === 'string' && possibleImage.startsWith('http') ? possibleImage : `http://localhost:8000${possibleImage}`) : null;

          const normalized = {
            ...prod,
            imagenUrl,
            stock: prod.cantidad_disponible ?? prod.stock ?? 0,
            peso: prod.peso_gramos ?? prod.peso ?? null,
            categoriaId: prod.categoria?.id || prod.categoriaId,
          };

          acc[catName][subName].push(normalized);
          return acc;
        }, {});
      }
      if (!append) {
        dispatch({ type: 'FETCH_CATALOG_SUCCESS', payload: catalogPayload });
      } else {
        // Append products to existing catalog structure
        // Merge catalogPayload into existing catalog state
        const current = { ...catalog };
        Object.entries(catalogPayload).forEach(([catName, subcats]) => {
          if (!current[catName]) current[catName] = {};
          Object.entries(subcats).forEach(([subName, products]) => {
            if (!current[catName][subName]) current[catName][subName] = [];
            current[catName][subName] = current[catName][subName].concat(products);
          });
        });
        dispatch({ type: 'FETCH_CATALOG_SUCCESS', payload: current });
      }

      // Update pagination state
      setSkip(skip + (Array.isArray(data) ? data.length : 0));
      setHasMore(Array.isArray(data) && data.length === limit);
    } catch (error) {
      console.error('Error loading catalog:', error);
      setLoadError(true);
      if (!error?._toastsShown) toast.error('Error al cargar el catálogo de productos');
    } finally {
      setIsLoading(false);
    }
  };

  const filterCatalogByCategory = (categoryId) => {
    const filtered = {};
    
    Object.entries(catalog).forEach(([categoryName, subcategories]) => {
      Object.entries(subcategories).forEach(([subcategoryName, products]) => {
        const filteredProducts = products.filter(
          product => product.categoriaId === categoryId
        );
        
        if (filteredProducts.length > 0) {
          if (!filtered[categoryName]) filtered[categoryName] = {};
          filtered[categoryName][subcategoryName] = filteredProducts;
        }
      });
    });
    
    setFilteredCatalog(filtered);
  };

  const handleFilterChange = (categoryId) => {
    setActiveFilter(categoryId);
  };

  const onLoadMoreSubcategory = (categoryName, subcategoryName) => {
    const key = `${categoryName}||${subcategoryName}`;
    setSubVisible((s) => ({ ...s, [key]: (s[key] || 3) + 3 }));
  };

  const onLoadMoreGlobal = () => setGlobalDisplayCount((c) => c + 6);
  const onLoadMoreFiltered = () => setFilteredDisplayCount((c) => c + 3);

  const loadCarousel = async () => {
    try {
      const data = await carouselService.getCarouselPublic();
      // Normalize backend fields (imagen_url, link_url) to frontend shape (imagenUrl, enlaceUrl)
      const normalized = Array.isArray(data)
        ? data.map((item) => ({
            ...item,
            imagenUrl: typeof item.imagen_url === 'string' && item.imagen_url
              ? (item.imagen_url.startsWith('http') ? item.imagen_url : `http://localhost:8000${item.imagen_url}`)
              : null,
            enlaceUrl: item.link_url ?? item.enlaceUrl ?? null,
          }))
        : [];
      dispatch({ type: 'FETCH_CAROUSEL_SUCCESS', payload: normalized });
    } catch (error) {
      console.error('Error loading carousel:', error);
    }
  };

  const handleAddToCart = (product) => {
    addToCartHandler(product, 1);
  };
  const carouselImages = carousel?.images || [];

  // Replaced manual scroll logic with SwiperCarousel component.

  if (minLoading || (isLoading && skip === 0)) {
    return (
      <div className="home-loading">
        <Loader />
        {loadError && (
          <div style={{ textAlign: 'center', marginTop: 12 }}>
            <p>No pudimos cargar los productos.</p>
            <button className="btn" onClick={() => loadCatalog({ skip: 0, append: false })}>Reintentar</button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="home-page">
      <Hero />

      {/* Carrusel de imágenes destacado */}
      <section className="carousel-section" aria-label="Carrusel de promociones">
        <div className="container">
          <SwiperCarousel images={carouselImages} showOverlay={true} />
        </div>
      </section>

      <FeaturedSection />

      {/* Category Filters */}
      <CategoryFilters 
        onFilterChange={handleFilterChange}
        activeFilter={activeFilter}
      />

      <div className="catalog-container">
        {(!activeFilter) ? (
          (() => {
            // Flat list across categories, paginated by globalDisplayCount
            const flat = Object.entries(catalog).reduce((acc, [categoryName, subcats]) => {
              Object.entries(subcats || {}).forEach(([subName, products]) => {
                (products || []).forEach((p) => acc.push({ ...p, _categoryName: categoryName, _subName: subName }));
              });
              return acc;
            }, []);
            const shown = flat.slice(0, globalDisplayCount);
            return (
              <div>
                <div className="products-grid">
                  {shown.map((product) => (
                    <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
                  ))}
                </div>
                {flat.length > shown.length && (
                  <div style={{ textAlign: 'center', margin: '24px 0' }}>
                    <button className="btn" onClick={onLoadMoreGlobal}>Ver más</button>
                  </div>
                )}
              </div>
            );
          })()
        ) : (
          // filtered by a category -> show a flat list of products for that category, paginated by 2
          (() => {
            const flatFiltered = Object.entries(catalog).reduce((acc, [categoryName, subcats]) => {
              Object.entries(subcats || {}).forEach(([subName, products]) => {
                (products || []).forEach((p) => {
                  const prodCatId = p.categoriaId ?? p.categoria?.id ?? null;
                  if (String(prodCatId) === String(activeFilter)) acc.push(p);
                });
              });
              return acc;
            }, []);
            const shown = flatFiltered.slice(0, filteredDisplayCount);
            return (
              <div>
                <div className="products-grid">
                  {shown.map((product) => (
                    <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
                  ))}
                </div>
                {flatFiltered.length > shown.length && (
                  <div style={{ textAlign: 'center', margin: '24px 0' }}>
                    <button className="btn" onClick={onLoadMoreFiltered}>Ver más</button>
                  </div>
                )}
              </div>
            );
          })()
        )}
      </div>

      {Object.keys(filteredCatalog).length === 0 && !isLoading && (
        <div className="empty-catalog">
          <p>
            {activeFilter 
              ? 'No hay productos disponibles en esta categoría.' 
              : 'No hay productos disponibles en este momento.'}
          </p>
        </div>
      )}
      {loadError && (
        <div style={{textAlign: 'center', marginTop: 24}}>
          <p>No pudimos cargar los productos.</p>
          <button className="btn" onClick={() => loadCatalog({ skip: 0, append: false })}>Reintentar</button>
        </div>
      )}
      {/* Load more button for pagination */}
      {hasMore && (
        <div style={{ textAlign: 'center', margin: '24px 0' }}>
          {isLoading ? (
            <div style={{ display: 'inline-block' }}><Loader message="Cargando..." /></div>
          ) : (
            <button className="btn" onClick={() => loadCatalog({ skip, append: true })}>Ver más</button>
          )}
        </div>
      )}

      {/* Error handling area: if loading failed, show retry - handled via toast on error; alternatively implement explicit retry state if needed */}
    </div>
  );
};

