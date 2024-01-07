import Link from "next/link";
import styles from "@/styles/Planets.module.css";

export default function Landing() {
  return (
    <div>
      <div className={styles.link}>
        <Link href="/capitalizer">capitalize</Link>
      </div>
      <div className={styles.link}>
        <Link href="/cosmere">cosmere</Link>
      </div>
      <div className={styles.link}>
        <Link href="/sandbox">sandbox</Link>
      </div>
      <div className={styles.link}>
        <Link href="/chess">chess</Link>
      </div>
    </div>
  );
}
