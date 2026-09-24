import React from 'react'

import AboutBanner from './AboutBanner'
import AboutPage from './AboutPage'
import Vision from './Vision'
import ReadyDifferenceBanner from './ReadyDifferenceBanner'
import WhyChooseSection from './WhyChooseSection'
import SustainabilitySection from './SustainabilitySection'
import NorthStar from './NorthStar'
import FounderSection from './FounderSection'
import ProductPromise from './ProductPromise'
import OvySection from './OvySection'
import { LoowaySection } from './LoowaySection'
import PlanetSection from './PlanetSection'
import RoshniSection from './RoshniSection'
import NumbersSection from './NumbersSection'
import Marquee from './Marquee'

const page = () => {
  return (
    <div>
      <AboutBanner />
      {/* <AboutPage />
      <Vision />
      <SustainabilitySection />
      <WhyChooseSection />
      <ReadyDifferenceBanner /> */}
      <Marquee />
      <NorthStar />
      <FounderSection />
      <ProductPromise />
      <OvySection />
      <LoowaySection />
      <PlanetSection />
      <RoshniSection />
      <NumbersSection />
    </div>
  )
}

export default page