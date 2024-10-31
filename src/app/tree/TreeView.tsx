import { Female, Male, SvgArrow, SvgArrowStraight } from "@/utils/Icons";

const TreeNode = ({ node } : {node:any}) => {
    return (
        <div className="bg-main_background pt-4 md:pt-6 last:-ml-[4px] last:pl-[4px] cursor-default">
            <div className="flex">
                {node.gen.map((data:any, index:any) => (
                <div key = {index} className={`flex items-start -ml-[2px] ${index===0 ? 'first:pt-0 pt-4 md:pt-6' : ''}`}>
                    {index===0 ?
                    <span className='-mt-[40px] md:-mt-[28px] block'><SvgArrow /></span>
                    : <span className='mt-[14px] md:mt-6 block'><SvgArrowStraight/></span>}
                    <div className="p-2 flex gap-2 justify-between items-center text-sm z-10 md:text-base md:px-4 md:py-3 bg-field_color text-text_color border-2 border-text_color text-nowrap whitespace-nowrap rounded-lg">
                        {data.gender === 'male' && <Male />}
                        {data.gender === 'female' && <Female />}
                        <span className="font-medium capitalize">{data.name}</span>
                    </div>
                </div> ) ) }
            </div>
            {<TreeView data={node?.next_gen} />}
        </div>
    )
};

const TreeView = ({data=[]} : {data:any}) => {    
    return (
        <div className="inline-block ml-20 first:ml-4 first:md:ml-8">
            <div className="border-l-2 md:border-l-2 border-text_color">              
                {data.map((node:any, index:any) => (
                    <TreeNode key={index} node={node} />
                ))}
            </div>
        </div>
    );
};

export default TreeView;