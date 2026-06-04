import { useState, FormEvent } from 'react';
import { useAuth } from '@/context/AuthContext';
import Icon from '@/components/ui/icon';

export default function LoginPage() {
  const { login } = useAuth();
  const [loginVal, setLoginVal] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!loginVal.trim() || !password.trim()) return;
    setLoading(true);
    setError('');
    try {
      await login(loginVal.trim(), password.trim());
    } catch {
      setError('Неверный логин или пароль');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 font-golos">
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-blue-500/5" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-blue-500/5" />
      </div>

      <div className="w-full max-w-sm relative">
        {/* Logo block */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary mb-4 shadow-lg">
            <Icon name="Wrench" size={26} className="text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">СервисПро</h1>
          <p className="text-sm text-muted-foreground mt-1">Система управления объектами</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-border shadow-sm p-6 space-y-5">
          <div>
            <h2 className="text-base font-semibold text-foreground">Вход в систему</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Введите логин и пароль, выданные администратором</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Login */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider">Логин</label>
              <div className="relative">
                <Icon name="User" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  autoComplete="username"
                  className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                  placeholder="Ваш логин"
                  value={loginVal}
                  onChange={e => setLoginVal(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider">Пароль</label>
              <div className="relative">
                <Icon name="Lock" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type={showPass ? 'text' : 'password'}
                  autoComplete="current-password"
                  className="w-full pl-9 pr-10 py-2.5 text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                  placeholder="Ваш пароль"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  disabled={loading}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setShowPass(p => !p)}
                >
                  <Icon name={showPass ? 'EyeOff' : 'Eye'} size={15} />
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 px-3 py-2.5 bg-red-50 border border-red-200 rounded-xl animate-fade-in">
                <Icon name="AlertCircle" size={14} className="text-red-500 flex-shrink-0" />
                <p className="text-xs text-red-700 font-medium">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !loginVal.trim() || !password.trim()}
              className="w-full py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                  </svg>
                  Входим...
                </>
              ) : (
                <>
                  Войти
                  <Icon name="ArrowRight" size={15} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Hint */}
        <p className="text-center text-xs text-muted-foreground mt-5">
          Не знаете логин? Обратитесь к администратору
        </p>
      </div>
    </div>
  );
}
