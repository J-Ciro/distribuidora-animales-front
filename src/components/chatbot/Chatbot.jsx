import React, { useState, useRef, useEffect } from 'react';
import './Chatbot.css';

// Base de conocimiento del chatbot con opciones de seguimiento
const knowledgeBase = {
  greetings: {
    responses: [
      "¡Guau guau! 🐕 Soy Max, tu asistente perruno. ¿En qué puedo ayudarte hoy?",
      "¡Hola! Soy Max 🐾 ¿Necesitas ayuda con algo?",
      "¡Woof! Max a tu servicio 🦴 ¿Qué necesitas saber?"
    ],
    suggestions: [
      "Ver productos",
      "¿Cómo comprar?",
      "Información de envíos",
      "Ver ofertas"
    ]
  },
  productos: {
    keywords: ['producto', 'productos', 'vender', 'venden', 'comprar', 'catálogo', 'artículo'],
    response: "¡Tenemos productos increíbles para todas las mascotas! 🐕🐱 Puedes ver nuestro catálogo completo en la página principal. Ofrecemos alimentos, juguetes, accesorios y mucho más.",
    suggestions: [
      "Productos para perros",
      "Productos para gatos",
      "Ver ofertas",
      "¿Cómo comprar?"
    ]
  },
  envios: {
    keywords: ['envío', 'envio', 'envíos', 'envios', 'entrega', 'delivery', 'domicilio'],
    response: "¡Hacemos envíos a todo el país! 📦 Los tiempos de entrega varían según tu ubicación. Generalmente entre 2-5 días hábiles. ¡Tu pedido llegará directo a tu puerta!",
    suggestions: [
      "Costo de envío",
      "Rastrear mi pedido",
      "Métodos de pago",
      "Ver mis pedidos"
    ]
  },
  pagos: {
    keywords: ['pago', 'pagos', 'pagar', 'tarjeta', 'efectivo', 'transferencia', 'método', 'costo'],
    response: "Aceptamos múltiples métodos de pago: tarjetas de crédito/débito, transferencias bancarias, Nequi, Daviplata, Addi Sistecredito y Efectivo Contra entrega 💳💰",
    suggestions: [
      "¿Es seguro?",
      "Información de envíos",
      "Crear cuenta",
      "Ver productos"
    ]
  },
  cuenta: {
    keywords: ['cuenta', 'registro', 'registrar', 'registrarme', 'crear cuenta', 'usuario'],
    response: "¡Crear una cuenta es súper fácil! 🎉 Solo haz clic en 'Registrarse' en el menú superior. Podrás hacer seguimiento de tus pedidos y guardar tus direcciones favoritas.",
    suggestions: [
      "Beneficios de la cuenta",
      "¿Cómo comprar?",
      "Ver productos",
      "Mis pedidos"
    ]
  },
  pedidos: {
    keywords: ['pedido', 'pedidos', 'orden', 'compra', 'seguimiento', 'rastreo', 'rastrear'],
    response: "Puedes ver todos tus pedidos en la sección 'Mis Pedidos' 📋 Ahí encontrarás el estado de tus compras y el historial completo.",
    suggestions: [
      "Información de envíos",
      "Hacer nueva compra",
      "Contactar soporte",
      "Ver productos"
    ]
  },
  contacto: {
    keywords: ['contacto', 'teléfono', 'email', 'correo', 'llamar', 'comunicar', 'soporte'],
    response: "¡Me encantaría ayudarte más! 📞 Puedes contactarnos directamente o navegar por nuestra web para más información.",
    suggestions: [
      "Horarios de atención",
      "Ver preguntas frecuentes",
      "Ver productos",
      "Información de envíos"
    ]
  },
  horario: {
    keywords: ['horario', 'hora', 'abierto', 'cerrado', 'atienden', 'atención'],
    response: "¡Nuestra tienda online está disponible 24/7! 🌟 Puedes hacer tus pedidos cuando quieras. Nuestro equipo procesa los pedidos de lunes a viernes de 9:00 AM a 6:00 PM.",
    suggestions: [
      "Contactar soporte",
      "Hacer una compra",
      "Ver productos",
      "Información de envíos"
    ]
  },
  perros: {
    keywords: ['perro', 'perros', 'can', 'canino', 'cachorro'],
    response: "¡Guau! 🐕 Tenemos una gran selección de productos para perros: alimentos premium, juguetes resistentes, camas cómodas, correas, collares y mucho más. ¡Todo para consentir a tu mejor amigo!",
    suggestions: [
      "Ver alimentos",
      "Productos para gatos",
      "Ver ofertas",
      "¿Cómo comprar?"
    ]
  },
  gatos: {
    keywords: ['gato', 'gatos', 'felino', 'gatito', 'michi'],
    response: "¡Miau! 🐱 Para los gatitos tenemos arena sanitaria, rascadores, juguetes, alimentos especializados y accesorios. ¡Todo para que tu minino esté feliz!",
    suggestions: [
      "Ver alimentos",
      "Productos para perros",
      "Ver ofertas",
      "¿Cómo comprar?"
    ]
  },
  ofertas: {
    keywords: ['oferta', 'ofertas', 'descuento', 'descuentos', 'promoción', 'promociones', 'rebaja'],
    response: "¡Siempre tenemos ofertas especiales! 🎁 Te recomiendo revisar nuestra página principal regularmente o crear una cuenta para recibir notificaciones de promociones exclusivas.",
    suggestions: [
      "Ver productos",
      "Crear cuenta",
      "Productos para perros",
      "Productos para gatos"
    ]
  },
  ayuda: {
    keywords: ['ayuda', 'help', 'auxilio', 'soporte', 'asistencia'],
    response: "¡Estoy aquí para ayudarte! 🐾 Puedes preguntarme sobre productos, envíos, pagos, tu cuenta, pedidos o cualquier duda que tengas sobre la tienda.",
    suggestions: [
      "Ver productos",
      "Información de envíos",
      "Métodos de pago",
      "Crear cuenta"
    ]
  },
  beneficios: {
    keywords: ['beneficio', 'beneficios', 'ventaja', 'ventajas'],
    response: "Con una cuenta podrás: guardar tus direcciones favoritas, hacer seguimiento de pedidos, recibir ofertas exclusivas y tener un proceso de compra más rápido. 🎁",
    suggestions: [
      "Crear cuenta",
      "Ver productos",
      "Ver ofertas",
      "¿Cómo comprar?"
    ]
  },
  seguridad: {
    keywords: ['seguro', 'seguridad', 'confiable', 'protección'],
    response: "¡Totalmente seguro! 🔒 Usamos encriptación SSL y sistemas de pago certificados. Tus datos están completamente protegidos.",
    suggestions: [
      "Métodos de pago",
      "Crear cuenta",
      "Ver productos",
      "Hacer una compra"
    ]
  },
  alimentos: {
    keywords: ['alimento', 'alimentos', 'comida', 'comer', 'alimentación'],
    response: "¡Tenemos alimentos premium para todas las edades y necesidades! 🍖 Desde cachorros hasta adultos mayores, con opciones especiales para dietas específicas.",
    suggestions: [
      "Productos para perros",
      "Productos para gatos",
      "Ver ofertas",
      "¿Cómo comprar?"
    ]
  }
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: "¡Guau guau! 🐕 Soy Max, tu asistente perruno. ¿En qué puedo ayudarte hoy?",
      timestamp: new Date(),
      suggestions: [
        "Ver productos",
        "¿Cómo comprar?",
        "Información de envíos",
        "Ver ofertas"
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll al último mensaje
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus en el input cuando se abre el chat
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const findBestResponse = (userMessage) => {
    const normalizedMessage = userMessage.toLowerCase().trim();
    
    // Saludos
    const greetingWords = ['hola', 'buenos', 'buenas', 'hey', 'ola', 'saludos'];
    if (greetingWords.some(word => normalizedMessage.includes(word))) {
      const randomGreeting = knowledgeBase.greetings.responses[
        Math.floor(Math.random() * knowledgeBase.greetings.responses.length)
      ];
      return {
        text: randomGreeting,
        suggestions: knowledgeBase.greetings.suggestions
      };
    }

    // Buscar en la base de conocimiento
    for (const [key, value] of Object.entries(knowledgeBase)) {
      if (key === 'greetings') continue;
      
      if (value.keywords && value.keywords.some(keyword => normalizedMessage.includes(keyword))) {
        return {
          text: value.response,
          suggestions: value.suggestions || []
        };
      }
    }

    // Respuesta por defecto
    return {
      text: "¡Woof! 🐕 No estoy seguro de entender esa pregunta. Puedo ayudarte con información sobre productos, envíos, pagos, tu cuenta o pedidos. ¿Sobre qué te gustaría saber?",
      suggestions: [
        "Ver productos",
        "Información de envíos",
        "Métodos de pago",
        "Crear cuenta"
      ]
    };
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Agregar mensaje del usuario
    const userMessage = {
      type: 'user',
      text: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    setShowSuggestions(false);

    // Simular tiempo de respuesta del bot
    setTimeout(() => {
      const botResponseData = findBestResponse(inputValue);
      const botMessage = {
        type: 'bot',
        text: botResponseData.text,
        timestamp: new Date(),
        suggestions: botResponseData.suggestions
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
      setShowSuggestions(true);
    }, 800 + Math.random() * 400); // Tiempo aleatorio entre 800-1200ms
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    // Auto-enviar la sugerencia
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  return (
    <>
      {/* Botón flotante */}
      <button
        className={`chatbot-toggle ${isOpen ? 'active' : ''}`}
        onClick={toggleChat}
        aria-label="Abrir chat de ayuda"
      >
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <img src="/max-dog-avatar.svg" alt="Max" className="chatbot-icon" />
        )}
        {!isOpen && <span className="chatbot-badge">Max</span>}
      </button>

      {/* Ventana del chat */}
      <div className={`chatbot-window ${isOpen ? 'open' : ''}`}>
        {/* Header */}
        <div className="chatbot-header">
          <div className="chatbot-header-info">
            <div className="chatbot-avatar">
              <img src="/max-dog-avatar.svg" alt="Max" className="avatar-image" />
            </div>
            <div>
              <h3>Max - Asistente Virtual</h3>
              <span className="chatbot-status">
                <span className="status-dot"></span>
                En línea
              </span>
            </div>
          </div>
          <button className="chatbot-close" onClick={toggleChat} aria-label="Cerrar chat">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Mensajes */}
        <div className="chatbot-messages">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.type}`}>
              {message.type === 'bot' && (
                <div className="message-avatar">
                  <img src="/max-dog-avatar.svg" alt="Max" className="avatar-image" />
                </div>
              )}
              <div className="message-content">
                <div className="message-bubble">{message.text}</div>
                <div className="message-time">{formatTime(message.timestamp)}</div>
                
                {/* Sugerencias después de cada respuesta del bot */}
                {message.type === 'bot' && message.suggestions && message.suggestions.length > 0 && 
                 index === messages.length - 1 && !isTyping && showSuggestions && (
                  <div className="message-suggestions">
                    {message.suggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        className="message-suggestion-btn"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="message bot">
              <div className="message-avatar">
                <img src="/max-dog-avatar.svg" alt="Max" className="avatar-image" />
              </div>
              <div className="message-content">
                <div className="message-bubble typing">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="chatbot-input-container">
          <input
            ref={inputRef}
            type="text"
            className="chatbot-input"
            placeholder="Escribe tu pregunta..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button
            className="chatbot-send"
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            aria-label="Enviar mensaje"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </button>
        </div>
      </div>
    </>
  );
};

export default Chatbot;
