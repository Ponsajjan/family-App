
import { Condolences, Female2, Male2, Verified } from '@/utils/Icons';
import { DateInfo, InformationSection, MemberItem } from '@/components/MemberDetailsComponents';

function MemberDetails({ data }: { data: any }) {
    return (
        <>
            {/* Header Section */}
            <div className='sticky top-0 z-10 bg-main_background pt-4 pb-2.5 md:pb-1 px-4 border-b border-border_color/40'>
                <div className='flex gap-2 items-center w-full pb-1.5 md:pb-3'>
                    <div className='border border-border_color p-2 rounded-md relative'>
                        {data.generalInformation.gender === 'Male' ? <Male2 /> : <Female2 />}
                        {data.generalInformation.deceased && (
                            <span className='absolute -bottom-2 -right-2'><Condolences /></span>
                        )}
                    </div>
                    <div className='w-full'>
                        <div className='text-lg font-semibold flex items-center'>
                            <span>{data.generalInformation.name || 'Name Unavailable'}</span>
                            {data.generalInformation.verified && <span className='pl-2'><Verified /></span>}
                        </div>

                        <DateInfo
                            prefix="Born At"
                            date={data.generalInformation.birthDate}
                            month={data.generalInformation.birthMonth}
                            year={data.generalInformation.birthYear}
                        />

                        {data.generalInformation.deceased && (
                            <DateInfo
                                prefix="Died At"
                                date={data.generalInformation.deathDate}
                                month={data.generalInformation.deathMonth}
                                year={data.generalInformation.deathYear}
                                fallback="Deceased"
                            />
                        )}
                    </div>
                </div>
                {data.mainMemberName && <div className='mr-0 ml-auto text-xs text-text_color/60 w-fit'>--- {data.mainMemberName} Family</div>}
            </div>

            <div className="px-4 pb-6">
                {/* Relation Information */}
                {data.relationInformation && (
                    <InformationSection title="Relation Information">
                        <MemberItem label="Father" value={data.relationInformation.father} />
                        <MemberItem label="Mother" value={data.relationInformation.mother} />
                        <MemberItem label="Father" value={data.relationInformation.nonDescendantRelations?.fatherName} />
                        <MemberItem label="Mother" value={data.relationInformation.nonDescendantRelations?.motherName} />
                        <MemberItem label="Partner" value={data.relationInformation.partner} />
                        <MemberItem
                            label={data.relationInformation.children?.length > 1 ? 'Children' : 'Child'}
                            value={data.relationInformation.children}
                            isList
                        />
                        <MemberItem
                            label={data.relationInformation.siblings?.length > 1 ? 'Siblings' : 'Sibling'}
                            value={data.relationInformation.siblings}
                            isList
                        />
                        <MemberItem
                            label={data.relationInformation.nonDescendantRelations?.siblingNames?.length > 1 ? 'Siblings' : 'Sibling'}
                            value={data.relationInformation.nonDescendantRelations?.siblingNames}
                        />
                    </InformationSection>
                )}

                {/* Contact Information */}
                {data.contactInformation && (
                    <InformationSection title="Contact Information">
                        <MemberItem label="Phone no." value={data.contactInformation.phoneNumber} />
                        <MemberItem label="Address" value={data.contactInformation.currentAddress} />
                    </InformationSection>
                )}

                {/* Personal Information */}
                {data.personalInformation && (
                    <InformationSection title="Personal Information">
                        <MemberItem label="Birth Place" value={data.personalInformation.birthPlace} />
                        <MemberItem label="Occupation" value={data.personalInformation.occupation} />
                        <MemberItem label="Education" value={data.personalInformation.education} />
                    </InformationSection>
                )}

                {/* Additional Information */}
                {data.additionalInformation && (
                    <InformationSection title="Additional Information">
                        <MemberItem value={data.additionalInformation.additionalInfo} />
                    </InformationSection>
                )}
            </div>
        </>
    )
}

export default MemberDetails