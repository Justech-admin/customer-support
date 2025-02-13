import { useRouter } from 'next/router'

export default function JammerDetails() {
  const router = useRouter()
  const { serialNum } = router.query

  return (
    <div>
      <h1>Jammer Serial Number: {serialNum}</h1>
    </div>
  )
}
