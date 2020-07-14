export interface BaseResponseI {
    status: number;
    description: string;
}

export interface KeyValuePairI {
    [key: string]: any;
}

export declare module UserSystem {
    export interface InfoI {
        hasRootSsl: boolean;
        forceSsl: boolean;
        rootDomain: string;
    }

    export interface UserSystemInfoI extends BaseResponseI {
        data: InfoI
    }
}

export declare module UserApps {
    export interface EnvVarI {
        key: string;
        value: string;
    }

    export interface VolumeI {
        containerPath: string;
        volumeName: string;
        hostPath?: string;
    }

    export interface PortI {
        hostPort: number;
        containerPort: number;
    }

    export interface VersionI {
        version: number;
        timeStamp: Date;
        deployedImageName: string;
        gitHash: string;
    }

    export interface CustomDomainI {
        publicDomain: string;
        hasSsl: boolean;
    }

    export interface DefinitionI {
        hasPersistentData: boolean;
        description: string;
        instanceCount: number;
        captainDefinitionRelativeFilePath: string;
        networks: string[];
        envVars: EnvVarI[];
        volumes: VolumeI[];
        ports: PortI[];
        versions: VersionI[];
        deployedVersion: number;
        notExposeAsWebApp: boolean;
        customDomain: CustomDomainI[];
        hasDefaultSubDomainSsl: boolean;
        forceSsl: boolean;
        websocketSupport: boolean;
        containerHttpPort: number;
        preDeployFunction: string;
        appName: string;
        isAppBuilding: boolean;
        nodeId: string;
    }

    export interface AppDefinitionDataI {
        appDefinitions: DefinitionI[];
        rootDomain: string;
        defaultNginxConfig: string;
    }

    export interface AppDefinitionsI extends BaseResponseI {
        data: AppDefinitionDataI
    }
}
