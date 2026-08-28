'use client'
import React, { useState } from 'react'
import { Plus, ArrowRight, Edit3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TransferModal } from '@/components/shared/dashboard/organization/configuration/modals/TransferModal'

const HerdInventoryPage = () => {
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false)

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in duration-300">
      {/* Cabecera de la sección */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Rodeo Único
          </h1>
        </div>

        <Button className="bg-[#2E7D53] hover:bg-[#236342] text-white font-semibold rounded-xl h-11 px-5 shadow-sm gap-2 w-fit">
          <Plus className="w-4 h-4" /> Registrar Alta
        </Button>
      </div>

      {/* Tarjetas de gestión de inventario */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tarjeta: Rodeo Único */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between space-y-4 relative">
          <div className="flex items-start justify-between">
            <div className="w-7 h-7 bg-emerald-50 rounded-lg flex items-center justify-center text-[#2E7D53]">
              <ArrowRight className="w-4 h-4 -rotate-45" />
            </div>
            <button className="text-gray-400 hover:text-gray-600 transition-colors">
              <Edit3 className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-gray-900">Rodeo Único</h3>
            <p className="text-xs text-gray-400 font-medium">
              Producción Intensiva
            </p>
          </div>
          <div>
            <span className="text-2xl font-extrabold text-[#2E7D53]">142</span>
            <span className="text-xs font-bold text-gray-500 ml-1.5 uppercase">
              cabezas
            </span>
          </div>
        </div>

        {/* Tarjeta: Registro de Altas */}
        <div className="bg-[#E8F5E9]/60 p-6 rounded-3xl border border-emerald-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center text-[#2E7D53] shadow-xs">
              <Plus className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-gray-900">
              Registro de Altas
            </h3>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white rounded-2xl shadow-xs cursor-pointer hover:bg-gray-50 transition-colors">
              <span className="text-xs font-semibold text-gray-800">
                Nacimientos
              </span>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </div>
            <div className="flex items-center justify-between p-3 bg-white rounded-2xl shadow-xs cursor-pointer hover:bg-gray-50 transition-colors">
              <span className="text-xs font-semibold text-gray-800">
                Compras Externas
              </span>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Tarjeta: Transferencia de Rodeo */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gray-50 rounded-lg flex items-center justify-center text-gray-600">
              <ArrowRight className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-gray-900">
              Transferencia de Rodeo
            </h3>
          </div>
          <p className="text-xs text-gray-500">
            Mueve animales de un rodeo a otro de manera ágil.
          </p>
          <Button
            onClick={() => setIsTransferModalOpen(true)}
            className="bg-[#2E7D53] hover:bg-[#236342] text-white font-semibold rounded-2xl h-11 w-full shadow-sm"
          >
            Nueva Transferencia
          </Button>
        </div>
      </div>

      {/* Tarjeta inferior: Registro de Bajas */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4 max-w-md">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-rose-50 rounded-lg flex items-center justify-center text-rose-600">
            <span className="text-xs font-bold">-</span>
          </div>
          <h3 className="text-sm font-bold text-gray-900">Registro de Bajas</h3>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-gray-50/50 rounded-2xl border border-gray-100 cursor-pointer hover:bg-gray-100/50 transition-colors">
            <span className="text-xs font-semibold text-rose-600">
              Venta de Animales
            </span>
            <ArrowRight className="w-4 h-4 text-gray-400" />
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50/50 rounded-2xl border border-gray-100 cursor-pointer hover:bg-gray-100/50 transition-colors">
            <span className="text-xs font-semibold text-rose-600">
              Otras Causas
            </span>
            <ArrowRight className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Modal de Nueva Transferencia */}
      <TransferModal
        open={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
      />
    </div>
  )
}

export default HerdInventoryPage
