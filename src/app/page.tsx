'use client';

import Image from "next/image";
import Link from "next/link";
import ProtectedButton from "@/components/ProtectedButton";
import { UserType } from "@/types/user";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-6 md:p-10">
      <header className="max-w-7xl mx-auto mb-12">
        <Navbar />
      </header>

      <main className="max-w-7xl mx-auto">
        <section className="mb-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Gerador de Roteiros para YouTube
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Crie roteiros, títulos, imagens e áudio para seus vídeos do YouTube com facilidade e rapidez.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card para Geração de Título */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-transform hover:scale-105 hover:shadow-xl">
            <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-full mb-4">
              <Image
                src="/title-icon.svg"
                alt="Ícone de Título"
                width={24}
                height={24}
                className="text-indigo-600 dark:text-indigo-400 dark:invert"
              />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Gerador de Títulos</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Crie títulos chamativos e otimizados para SEO para seus vídeos do YouTube.
            </p>
            <ProtectedButton
              requiredTypes={[UserType.BASIC, UserType.PREMIUM, UserType.ADMIN]}
              onUnauthorized={() => alert('Você precisa estar logado para criar títulos.')}
            >
              Criar Título
            </ProtectedButton>
          </div>

          {/* Card para Geração de Roteiro */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-transform hover:scale-105 hover:shadow-xl">
            <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-full mb-4">
              <Image
                src="/script-icon.svg"
                alt="Ícone de Roteiro"
                width={24}
                height={24}
                className="text-indigo-600 dark:text-indigo-400 dark:invert"
              />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Gerador de Roteiros</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Desenvolva roteiros completos e estruturados para seus vídeos.
            </p>
            <ProtectedButton
              requiredTypes={[UserType.BASIC, UserType.PREMIUM, UserType.ADMIN]}
              onUnauthorized={() => alert('Você precisa estar logado para criar roteiros.')}
            >
              Criar Roteiro
            </ProtectedButton>
          </div>

          {/* Card para Geração de Imagem */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-transform hover:scale-105 hover:shadow-xl">
            <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-full mb-4">
              <Image
                src="/image-icon.svg"
                alt="Ícone de Imagem"
                width={24}
                height={24}
                className="text-indigo-600 dark:text-indigo-400 dark:invert"
              />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Gerador de Imagens</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Crie thumbnails e imagens atraentes para seus vídeos do YouTube.
            </p>
            <ProtectedButton
              requiredTypes={[UserType.PREMIUM, UserType.ADMIN]}
              onUnauthorized={() => alert('Você precisa ter uma conta premium para criar imagens.')}
            >
              Criar Imagem
            </ProtectedButton>
          </div>

          {/* Card para Geração de Áudio */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-transform hover:scale-105 hover:shadow-xl">
            <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-full mb-4">
              <Image
                src="/audio-icon.svg"
                alt="Ícone de Áudio"
                width={24}
                height={24}
                className="text-indigo-600 dark:text-indigo-400 dark:invert"
              />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Gerador de Áudio</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Converta seu roteiro em áudio com vozes naturais para seus vídeos.
            </p>
            <ProtectedButton
              requiredTypes={[UserType.PREMIUM, UserType.ADMIN]}
              onUnauthorized={() => alert('Você precisa ter uma conta premium para criar áudios.')}
            >
              Criar Áudio
            </ProtectedButton>
          </div>

          {/* Card para Geração Completa */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-500 rounded-xl shadow-lg p-6 md:col-span-2 lg:col-span-2 transition-transform hover:scale-105 hover:shadow-xl">
            <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-4">
              <Image
                src="/complete-icon.svg"
                alt="Ícone de Serviço Completo"
                width={24}
                height={24}
                className="text-white invert"
              />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Geração Completa</h2>
            <p className="text-white/90 mb-4">
              Crie um pacote completo com roteiro, áudio e imagens para seu vídeo do YouTube em um único processo.
            </p>
            <ProtectedButton
              requiredTypes={[UserType.ADMIN]}
              onUnauthorized={() => alert('Apenas administradores podem acessar esta funcionalidade.')}
              className="w-full px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-gray-100 transition-colors duration-200 font-medium"
            >
              Criar Pacote Completo
            </ProtectedButton>
          </div>
        </section>
      </main>

      <footer className="max-w-7xl mx-auto mt-20 pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-gray-500 dark:text-gray-400 text-sm">
        <p>© {new Date().getFullYear()} Roteiro YouTube. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
