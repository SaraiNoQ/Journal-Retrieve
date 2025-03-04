import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: { secretKey: string }) => void;
  currentSettings: {
    secretKey: string;
  };
}

export default function SettingsModal({
  isOpen,
  onClose,
  onSave,
  currentSettings,
}: SettingsModalProps) {
  const [settings, setSettings] = useState(currentSettings);
  const [showPassword, setShowPassword] = useState(false);

  const handleSave = () => {
    onSave(settings);
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-purple-900 p-6 text-left align-middle shadow-xl transition-all border border-purple-500/20">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-white mb-4"
                >
                  系统设置
                </Dialog.Title>
                <div className="mt-2">
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="secretKey"
                        className="block text-sm font-medium text-gray-300 mb-2"
                      >
                        API 密钥
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          id="secretKey"
                          value={settings.secretKey}
                          onChange={(e) =>
                            setSettings({ ...settings, secretKey: e.target.value })
                          }
                          className="w-full px-4 py-2 rounded-lg bg-white/10 border border-purple-500/20 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 text-white placeholder-gray-400 pr-10"
                          placeholder="请输入 API 密钥（easyscholar.cc获取）"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                        >
                          {showPassword ? (
                            <EyeSlashIcon className="h-5 w-5" />
                          ) : (
                            <EyeIcon className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-lg px-4 py-2 text-sm font-medium text-gray-300 hover:text-white border border-purple-500/20 hover:bg-purple-500/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2"
                    onClick={onClose}
                  >
                    取消
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-lg px-4 py-2 text-sm font-medium text-white bg-purple-500 hover:bg-purple-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2"
                    onClick={handleSave}
                  >
                    保存
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
} 