import styles from '../../../styles/GoogleMaterial.module.css';

type Props = {
  signInWithGoogle: () => void;
};
export const GoogleMaterial = ({ signInWithGoogle }: Props) => {
  return (
    <button
      type="button"
      onClick={signInWithGoogle}
      className={`
        ${styles.button}
        flex items-center justify-center
        w-[183px] h-[40px]
        px-3
      `}
    >
      <div className={styles.state} />

      <div className="flex items-center gap-[10px] relative z-10">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
          className="w-5 h-5"
        >
          {/* path */}
        </svg>

        <span className="font-medium">Sign in with Google</span>
      </div>
    </button>
  );
};
