
export function AvatarCircle({ letter, size = 'md' }) {
  const sizeClasses =
    size === 'lg'
      ? 'w-20 h-20 text-3xl'
      : size === 'sm'
      ? 'w-10 h-10 text-lg'
      : 'w-14 h-14 text-2xl';

  return (
    <div
      className={`${sizeClasses} bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center flex-shrink-0`}
    >
      <span className="text-white">{letter}</span>
    </div>
  );
}
