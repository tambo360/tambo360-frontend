import BackToLoginTrap from '@/components/shared/dashboard/organization/configuration/BackToLoginTrap'
import CuestionarioBackButton from '@/components/shared/dashboard/organization/configuration/CuestionarioBackButton'
import Configuration from '@/components/shared/dashboard/organization/configuration/Configuration'

const Page = () => {
  return (
    <>
      <BackToLoginTrap />
      <div className="px-8 pt-8 md:hidden">
        <CuestionarioBackButton />
      </div>
      <Configuration />
    </>
  )
}
export default Page
