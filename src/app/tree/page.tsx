import Topnav from "@/components/Topnav"
import TreeView from "./TreeView"
import { SearchIcon } from "@/utils/Icons"

const data = {
    "data": [
        {
            "gen": [{"name": "Jothi", "gender": "female"}, {"name": "raja", "gender": "male"}],
            "next_gen": [
                {
                    "gen": [{"name": "jr sajjan", "gender": "male"}],
                    "next_gen": []
                },
                {
                    "gen": [{"name": "jr sudhan", "gender": "male"}],
                    "next_gen": []
                }
            ]
        },
        {
            "gen": [{"name": "mr.mohan", "gender": "male"}, {"name": "ms.mohan", "gender": "female"}],
            "next_gen": [
                {
                    "gen": [{"name": "jr mohan I", "gender": "male"}, {"name": "ms mohana", "gender": "female"}],
                    "next_gen": [
                        {
                            "gen": [{"name": "mohan II", "gender": "male"}],
                            "next_gen": [
                                {
                                    "gen": [{"name": "jr mohan I", "gender": "male"}, {"name": "ms mohana", "gender": "female"}],
                                    "next_gen": []
                                }
                            ]
                        },
                    ]
                }
            ]
        },
        {
            "gen": [{"name": "susila", "gender": "female"}],
            "next_gen": []
        },
        {
            "gen": [{"name": "kala", "gender": "female"}],
            "next_gen": []
        },
        {
            "gen": [{"name": "rajam", "gender": "female"}],
            "next_gen": []
        },
        {
            "gen": [
                {
                    "name": "Babu", "gender": "male"
                },
                {
                    "name": "ms. Babu", "gender": "female"
                }
            ],
            "next_gen": [
                {
                    "gen": [
                        {
                            "name": "Vinod", "gender": "male"
                        },
                        {
                            "name": "ms Vinod", "gender": "female"
                        }
                    ],
                    "next_gen": [
                        {   "gen": [
                                {
                                    "name": "Vinod I", "gender": "male"
                                }
                            ],
                            "next_gen": []
                        }
                    ]
                }
            ]
        }
    ]
}


export default function Calender() {
    return (
        <div className="w-full">
            <Topnav>
            </Topnav>
            <div className="pl-2 md:px-8 pr-4 overflow-auto h-[calc(100vh-3rem)]">
                <TreeView data={data.data} />
            </div>
        </div>
    )
}