interface EmptyStateProps {
  title?: string;
  message?: string;
  actionText?: string;
  onAction?: () => void;
}

const EmptyState = ({
  title = "No Data Found",
  message = "There is nothing to show here.",
  actionText,
  onAction,
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-5xl mb-4">📚</div>

      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        {title}
      </h3>

      <p className="text-gray-600 mb-4 max-w-sm">
        {message}
      </p>

      {actionText && onAction && (
        <button
          onClick={onAction}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
