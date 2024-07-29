import styles from './main.module.scss'

export default function Home() {
  
  return (
    <main class={styles.wrapper}>
      <div class={styles.header}></div>
      <form action="">
        <div class={styles.container}>
          <input type="text" />
          <button>Send</button>
        </div>
      </form>
    </main>
  );
}
