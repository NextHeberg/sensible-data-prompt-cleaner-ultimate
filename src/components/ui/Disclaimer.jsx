/**
 * Disclaimer modal and footer notice.
 */
import { createSignal, Show } from 'solid-js';

export function Disclaimer() {
  const [open, setOpen] = createSignal(false);

  return (
    <>
      {/* Footer strip */}
      <div class="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-500">
        <span class="text-amber-400">⚠</span>
        <span>
          Cet outil <strong class="text-zinc-400">assiste</strong> la détection — il ne garantit pas la suppression complète.
        </span>
        <button
          onClick={() => setOpen(true)}
          class="underline hover:text-zinc-300 transition-colors"
        >
          En savoir plus
        </button>
      </div>

      {/* Modal */}
      <Show when={open()}>
        <div
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div class="bg-zinc-900 dark:bg-zinc-900 border border-zinc-700 rounded-xl max-w-lg w-full p-6 shadow-2xl">
            <div class="flex items-start justify-between mb-4">
              <h2 class="text-lg font-semibold text-white flex items-center gap-2">
                <span class="text-amber-400">⚠</span>
                Avertissement & Responsabilité
              </h2>
              <button
                onClick={() => setOpen(false)}
                class="text-zinc-400 hover:text-white transition-colors text-xl leading-none"
              >
                ×
              </button>
            </div>

            <div class="space-y-3 text-sm text-zinc-300 leading-relaxed">
              <p>
                <strong class="text-white">Cet outil est une aide, pas une garantie.</strong> Il détecte
                les patterns courants via des expressions régulières. Il peut manquer des données
                sensibles non standard.
              </p>

              <ul class="space-y-2 pl-4 list-disc text-zinc-400">
                <li>
                  <strong class="text-zinc-300">Faux positifs</strong> — Les adresses IP dans du code
                  d'exemple ou les emails fictifs dans des templates seront détectés.
                </li>
                <li>
                  <strong class="text-zinc-300">Faux négatifs</strong> — Un mot de passe comme{' '}
                  <code class="bg-zinc-800 px-1 rounded">monchien2023</code> ne sera pas détecté.
                </li>
                <li>
                  <strong class="text-zinc-300">Noms propres</strong> — La détection est expérimentale
                  et très approximative. Activez-la avec précaution.
                </li>
                <li>
                  <strong class="text-zinc-300">Formats structurés</strong> — Une valeur d'exemple
                  dans un schéma JSON sera traitée identiquement à une vraie donnée.
                </li>
              </ul>

              <p class="text-amber-400/80 font-medium">
                Vous restez responsable de la vérification du prompt nettoyé avant de l'envoyer à un
                service externe.
              </p>

              <p class="text-xs text-zinc-500">
                Toutes les données sont traitées <strong class="text-zinc-400">localement dans votre navigateur</strong>.
                Rien n'est transmis à un serveur.
              </p>
            </div>

            <button
              onClick={() => setOpen(false)}
              class="mt-5 w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg py-2 text-sm font-medium transition-colors"
            >
              Compris
            </button>
          </div>
        </div>
      </Show>
    </>
  );
}
