'use client'
import {
  Droplet,
  SquarePen,
  CirclePlus,
  FileSpreadsheet,
  Sparkles,
  Milk,
} from 'lucide-react'

interface ProductoDestino {
  id: number
  nombre: string
  destinos?: string[]
  sinDestinos?: boolean
  tipoIcono: 'leche' | 'queso' | 'crema' | 'suero'
}

const PRODUCTOS_DESTINO_DATA: ProductoDestino[] = [
  {
    id: 1,
    nombre: 'Leche fluida',
    destinos: ['Planta Industrial', 'Consumo Interno', 'Venta a Terceros'],
    tipoIcono: 'leche',
  },
  {
    id: 2,
    nombre: 'Queso Cremoso',
    destinos: ['Planta Industrial', 'Venta a Terceros'],
    tipoIcono: 'queso',
  },
  {
    id: 3,
    nombre: 'Crema',
    sinDestinos: true,
    tipoIcono: 'crema',
  },
  {
    id: 4,
    nombre: 'Suero de Quesería',
    destinos: ['Consumo Interno'],
    tipoIcono: 'suero',
  },
]

export default function ProductosDestinoTab() {
  const handleAddProduct = () => {
    console.log('Abriendo modal para agregar un nuevo producto destino...')
  }

  const handleEditProduct = (id: number) => {
    console.log(`Editando producto con ID: ${id}`)
  }

  return (
    <div className="w-full bg-[#FAFAFA] antialiased min-h-screen pt-4 pb-12">
      <div className="max-w-300 mx-auto px-4">
        {/* Título de la Sección */}
        <h2 className="text-[15px] font-bold text-gray-800 mb-6 tracking-tight">
          Productos Destino
        </h2>

        {/* Rejilla de Tarjetas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {PRODUCTOS_DESTINO_DATA.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-100 rounded-xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between min-h-[180px] relative transition-all hover:shadow-[0_4px_20px_rgba(0,0,0,0.05)]"
            >
              {/* Fila Superior: Icono de Categoría y Botón Editar */}
              <div className="flex items-center justify-between mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                  {item.tipoIcono === 'leche' && (
                    <Droplet
                      className="text-[#217B53] fill-[#217B53]"
                      size={22}
                    />
                  )}
                  {item.tipoIcono === 'queso' && (
                    <FileSpreadsheet className="text-gray-400" size={20} />
                  )}
                  {item.tipoIcono === 'crema' && (
                    <Sparkles className="text-gray-400" size={20} />
                  )}
                  {item.tipoIcono === 'suero' && (
                    <Milk className="text-[#217B53]" size={20} />
                  )}
                </div>

                <button
                  onClick={() => handleEditProduct(item.id)}
                  className="text-gray-400 hover:text-gray-700 transition-colors"
                >
                  <SquarePen size={16} />
                </button>
              </div>

              {/* Información del Producto */}
              <div className="flex-1 flex flex-col justify-start">
                <h3 className="text-[15px] font-bold text-gray-900 mb-2">
                  {item.nombre}
                </h3>

                <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-2">
                  {item.sinDestinos
                    ? 'Sin destinos asignados'
                    : 'Destinos Asignados'}
                </p>

                {/* Renderizado Condicional de Destinos o Configuración */}
                {item.sinDestinos ? (
                  <button className="text-xs text-gray-700 font-medium underline text-left mt-1 hover:text-black transition-colors">
                    Configurar destino
                  </button>
                ) : (
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {item.destinos?.map((destino, index) => (
                      <span
                        key={index}
                        className="px-2 py-0.5 bg-[#E8F5E9] text-[#2E7D32] text-[10px] font-bold rounded"
                      >
                        {destino}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Tarjeta de Acción: Nuevo Producto */}
          <div
            onClick={handleAddProduct}
            className="bg-white border-2 border-dashed border-gray-200 rounded-xl p-5 flex flex-col items-center justify-center min-h-[180px] cursor-pointer hover:border-[#217B53] transition-all group"
          >
            <CirclePlus
              className="text-gray-800 mb-2 group-hover:text-[#217B53] transition-colors"
              size={32}
            />
            <span className="text-[14px] font-bold text-gray-900">
              Nuevo Producto
            </span>
            <span className="text-xs text-gray-400 mt-1 font-medium">
              Añadir catálogo de producción
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
