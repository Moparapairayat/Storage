// TODO: check if the currentUser has admin privileges

import { Models } from "node-appwrite";
import Thumbnail from "@/components/Thumbnail";
import FormattedDateTime from "@/components/FormattedDateTime";
import { convertFileSize, formatDateTime } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Switch } from "@/components/ui/switch";

const ImageThumbnail = ({ file }: { file: Models.Document }) => (
    <div className={"file-details-thumbnail"}>
        <Thumbnail type={file.type} extension={file.extension} url={file.url} />

        <div className={"flex flex-col"}>
            <p className={"subtitle-2 mb-1"}>{file.name}</p>
            <FormattedDateTime date={file.$createdAt} className={"caption"} />
        </div>
    </div>
);

const DetailRow = ({ label, value }: { label: string; value: string }) => (
    <div className={"flex"}>
        <p className={"file-details-label text-left"}>{label}</p>
        <p className={"file-details-value text-left"}>{value}</p>
    </div>
);
export const FileDetails = ({ file }: { file: Models.Document }) => {
    return (
        <>
            <ImageThumbnail file={file} />
            <div className={"space-y-4 px-2 pt-2"}>
                <DetailRow label={"Format:"} value={file.extension} />
                <DetailRow label={"Size:"} value={convertFileSize(file.size)} />
                <DetailRow label={"Owner:"} value={file.owner.fullName} />
                <DetailRow
                    label={"Last edit:"}
                    value={formatDateTime(file.$updatedAt)}
                />
            </div>
        </>
    );
};

interface Props {
    file: Models.Document;
    onInputChange: React.Dispatch<React.SetStateAction<string[]>>;
    onRemove: (email: string) => void;
    currentUserEmail: string;
    setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ShareInput = ({
                               file,
                               onInputChange,
                               onRemove,
                               currentUserEmail,
                               setIsAdmin,
                           }: Props) => {
    // console.log(isAdmin);
    const totalSharedUser = file.users.length + file.AdminUsers.length;
    return (
        <>
            <ImageThumbnail file={file} />

            <div className={"share-wrapper"}>
                <p className={"subtitle-2 pl-1 text-light-100"}>
                    Share file with other user
                </p>
                <Input
                    type="email"
                    placeholder="Enter email address"
                    onChange={(e) => {
                        const inputEmails = e.target.value.trim().split(",");
                        onInputChange(inputEmails);
                    }}
                    className="share-input-field"
                />

                {file.owner.email === currentUserEmail && (
                    <div className="my-2 flex gap-2">
                        <Switch
                            onCheckedChange={(checked) => setIsAdmin(checked)}
                            className={"data-[state=checked]:bg-red"}
                        />
                        <div className="flex flex-col gap-2 text-left">
                            <p className="subtitle-2 text-light-100">
                                Provide Admin Privileges
                            </p>
                            <p className="subtitle-2 text-justify text-light-200">
                                This includes allowing the user to rename, delete, and share
                                files, ensuring that shared users do not receive admin
                                privileges.
                            </p>
                        </div>
                    </div>
                )}

                <div className={"pt-4"}>
                    <div className={"flex justify-between"}>
                        <p className={"subtitle-2 text-light-100"}>Shared with</p>
                        <p className={"subtitle-2 text-light-200"}>
                            {totalSharedUser} users
                        </p>
                    </div>

                    <ul className={"pt-2 "}>
                        {file.AdminUsers.map((email: string) => (
                            <li
                                key={email}
                                className={"flex items-center justify-between gap-2 py-2"}
                            >
                                <p className={"subtitle-2"}>{email}</p>
                                <p className={"subtitle-2 text-green"}>Admin</p>

                                {currentUserEmail === file.owner.email && (
                                    <Button
                                        onClick={() => onRemove(email)}
                                        className={"share-remove-user"}
                                    >
                                        <Image
                                            src={"/assets/icons/remove.svg"}
                                            alt={"Remove"}
                                            width={24}
                                            height={24}
                                            className={"remove-icon"}
                                        />
                                    </Button>
                                )}
                            </li>
                        ))}
                        {file.users.map((email: string) => (
                            <li
                                key={email}
                                className={"flex items-center justify-between gap-2 py-2"}
                            >
                                <p className={"subtitle-2"}>{email}</p>

                                {currentUserEmail === file.owner.email && ( // TODO: check if current user is in admin email array
                                    <Button
                                        onClick={() => onRemove(email)}
                                        className={"share-remove-user"}
                                    >
                                        <Image
                                            src={"/assets/icons/remove.svg"}
                                            alt={"Remove"}
                                            width={24}
                                            height={24}
                                            className={"remove-icon"}
                                        />
                                    </Button>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
};
