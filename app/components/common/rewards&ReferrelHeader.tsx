import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";


const RewardsReferrelHeader = ({tittle,description}:any) => {
    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>{tittle}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </CardHeader>
            </Card>
        </>
    );
}

export default RewardsReferrelHeader;
