import Container from '@/components/Container'
import Topnav from '@/components/Topnav'
import React from 'react'

function page() {
  return (
    <div className='flex flex-col w-full text-text_color'>
      <Topnav> </Topnav>
      <Container>
        <div className="max-w-4xl mx-auto p-4">
          <h1 className="text-2xl md:text-3xl font-bold text-center mb-4">
            Shanmuga Nadar Family, Birthday & Remembrance
          </h1>

          <p className="text-lg text-center mb-3">
            This app is created exclusively for the Shanmuga Nadar family to honor and remember significant dates, such as birthdays and anniversaries of remembrance.
          </p>

          <div className="bg-field_color shadow-md border border-border_color rounded-lg p-4 mb-6">
            <h2 className="text-xl font-semibold mb-4">Access is limited to:</h2>
            <ul className="list-disc list-inside">
              <li>Direct descendants of Shanmuga Nadar</li>
              <li>Their partner (spouse or significant other)</li>
            </ul>
            <p className="mt-4 italic opacity-65">
              Note: Extended family members (such as aunts, uncles, and cousins) are excluded to maintain simplicity and ensuring that each member remains relevant to each other.
            </p>
          </div>

          <div className="bg-field_color shadow-md border border-border_color rounded-lg p-4 mb-6">
            <h2 className="text-xl font-semibold mb-4">Guidelines:</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Ensure family descendants are accurately recorded</li>
              <li>Add family relationships (partner & children) if any.</li>
            </ul>
            <p className="mt-4 italic opacity-65">
              Note: Family member information can be locked to maintain data integrity. For locked member, please submit a note for changes to be made or contact the moderator directly.
            </p>
          </div>

          {/* Moderator List Section */}
          <div className="bg-field_color shadow-md border border-border_color rounded-lg p-4 mb-6">
            <h2 className="text-xl font-semibold mb-4">Moderator List:</h2>
            <ul className="list-disc list-inside">
              <li>Ponsajjan</li>
            </ul>
            <p className="mt-4 italic opacity-65">
              Moderators are responsible for maintaining the integrity of the app and approving any critical changes.
            </p>
          </div>

          {/* Contribution Section */}
          {/* <div className="bg-field_color shadow-md border border-border_color rounded-lg p-4"> */}
            <h2 className="text-xl font-semibold mb-4">Contribute to the App:</h2>
            <p className="mb-4">
              This app is open for improvements. If you'd like to suggest changes or add new features, please fork the code from the GitHub repository and submit your contributions.
            </p>
            <a 
              href="https://github.com/your-repo-link" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-500 underline"
            >
              Fork the repository on GitHub
            </a>
          </div>
        {/* </div> */}
      </Container>
    </div>
  )
}

export default page
