interface InfoCardProps {
    title: string;
    description: string;
    date: string;
}

const InfoCard = ({ title, description, date }: InfoCardProps) => {
    return (
        <div className="w-5/12 relative bg-mytheme/20 p-4 duration-200">
            <div className="shadow-lg p-2 md:p-4 bg-white text-black font-semibold rounded-md text-center w-fit">
                {title}
            </div>
            <div className="-mx-3 p-3 text-[12px] md:text-sm">
                {description}
            </div>
            <div className="text-sm font-semibold underline">
                {date}
            </div>
        </div>
    );
};

export default InfoCard;