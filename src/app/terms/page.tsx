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
          Shanmuga Nadar Family Birthday & Remembrance App
        </h1>

        <p className="text-lg text-center mb-3">
          This app is created exclusively for the Shanmuga Nadar family in efforts to honor and remember significant dates such as birthdays and remembrance.
        </p>

        <div className="bg-field_color shadow-md border border-border_color rounded-lg p-4 mb-6">
          <h2 className="text-xl font-semibold mb-4">Access is limited to:</h2>
          <ul className="list-disc list-inside">
            <li>Direct descendants of Shanmuga Nadar</li>
            <li>Their partners (spouses or significant others)</li>
          </ul>
          <p className="mt-4 italic opacity-65">
            Note: Extended family members (such as aunts, uncles, and cousins) are excluded to maintain simplicity and focus on close family connections, ensuring that each member remains relevant to each other.
          </p>
        </div>

        <div className="bg-field_color shadow-md border border-border_color rounded-lg p-4 mb-6">
          <h2 className="text-xl font-semibold mb-4">Guidelines:</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Keep your contact information current.</li>
            <li>Ensure family descendant is marked correctly</li>
            <li>Ensure profiles for all immediate family members are added.</li>
            <li>Add family relationships (partner & children) if any.</li>
          </ul>
          <p className="mt-4 italic opacity-65">
            Note: Family member information can be locked to maintain data integrity. For locked member, please submit a note for changes to be made or contact the moderator directly.
          </p>
        </div>

{/* 
        <div className="bg-field_color shadow-md border border-border_color rounded-lg p-4 mb-6">
          <h2 className="text-xl font-semibold mb-4">Moderator List:</h2>

        </div>

        <div className="bg-field_color shadow-md border border-border_color rounded-lg p-4 mb-6">
          <h2 className="text-xl font-semibold mb-4">Moderator List:</h2>
          <p>
          Family dynamics are deeply intricate, shaped by a web of interactions and individual perceptions. Each family member experiences and interprets situations through their own unique lens, influenced by personal history and emotions. This means that two people can share the same event yet remember it differently, emphasizing certain aspects while letting go of others. Often, this selective memory is a subconscious survival mechanism, allowing us to cope with emotional complexities by focusing on what we can manage and sidelining more distressing details.

  This process is tied to our need for emotional self-preservation. Our minds filter experiences to protect us from overwhelming stress or trauma, creating a narrative that helps maintain our emotional balance. This can sometimes lead to misunderstandings within the family, as each person’s version of events can differ significantly. Recognizing this can foster empathy and understanding, as we appreciate that each family member’s recollections and reactions are valid reflections of their own coping strategies.

  In the context of family relationships, this dynamic underscores the importance of open communication and emotional intelligence. By acknowledging the different ways we perceive and process our shared experiences, we can better navigate conflicts and build stronger connections. Understanding that every family member holds onto certain memories while letting go of others invites us to approach each other with greater compassion and a willingness to bridge our diverse perspectives. This empathy can help us heal and grow together, honoring each person’s journey and the unique ways they’ve learned to survive and thrive.
          </p>
        </div> */}
      </div>
    </Container>
  </div>
  )
}

export default page