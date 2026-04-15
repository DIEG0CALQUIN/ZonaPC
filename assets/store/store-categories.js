// Estructura de categorias y subcategorias para mega menu
window.STORE_PRODUCT_CATEGORIES = window.STORE_PRODUCT_CATEGORIES || [
  {
    value: 'pc', label: 'PCs y laptops', icon: '🖥️',
    subs: [
      { value: 'pc', label: 'PCs de escritorio' },
      { value: 'laptops', label: 'Laptops y notebooks' },
      { value: 'monitores', label: 'Monitores y pantallas' }
    ]
  },
  {
    value: 'componentes', label: 'Componentes', icon: '🔩',
    subs: [
      { value: 'cpu', label: 'Procesadores (CPU)' },
      { value: 'placas-madre', label: 'Placas madre' },
      { value: 'memorias', label: 'Memorias RAM' },
      { value: 'gpu', label: 'Tarjetas graficas (GPU)' },
      { value: 'almacenamiento', label: 'Almacenamiento SSD y HDD' },
      { value: 'fuentes-poder', label: 'Fuentes de poder' },
      { value: 'gabinetes', label: 'Gabinetes' },
      { value: 'refrigeracion', label: 'Refrigeracion y coolers' }
    ]
  },
  {
    value: 'perifericos', label: 'Perifericos', icon: '🖱️',
    subs: [
      { value: 'teclados', label: 'Teclados' },
      { value: 'mouse', label: 'Mouse' },
      { value: 'mousepads', label: 'Mousepads' }
    ]
  },
  {
    value: 'audio', label: 'Audio', icon: '🎧',
    subs: [
      { value: 'audio', label: 'Audio y headsets' },
      { value: 'microfonos', label: 'Microfonos' }
    ]
  },
  {
    value: 'accesorios', label: 'Accesorios', icon: '🎮',
    subs: [
      { value: 'webcams', label: 'Webcams' },
      { value: 'streaming', label: 'Streaming y creacion' },
      { value: 'cables', label: 'Cables y adaptadores' },
      { value: 'redes', label: 'Redes y conectividad' },
      { value: 'impresoras', label: 'Impresoras y escaneres' },
      { value: 'iluminacion', label: 'Iluminacion RGB' },
      { value: 'sillas-gaming', label: 'Sillas gaming' }
    ]
  },
  {
    value: 'software', label: 'Software y licencias', icon: '🧩',
    subs: [
      { value: 'software', label: 'Software y licencias' }
    ]
  },
  {
    value: 'all', label: 'Todas las categorias', icon: '📦', subs: []
  }
];
