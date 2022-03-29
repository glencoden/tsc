import { makeStyles } from '@material-ui/core/styles';

export const useListStyles = makeStyles(theme => ({
    card: {
        margin: '10px 0'
    },
    cardActive: {
        backgroundColor: theme.palette.secondary.light
    },
    cardContent: {
        display: 'grid',
        gridTemplateColumns: 'auto 160px'
    },
    cardActions: {
        justifySelf: 'end',
        alignSelf: 'start'
    },
    contrastText: {
        color: theme.palette.grey['100']
    },
    gymnasticsTag: {
        color: theme.palette.primary.main
    }
}));

export const useManagerStyles = makeStyles(theme => ({
    card: {
        margin: '10px 0'
    },
    flexRow: {
        display: 'flex'
    },
    gridRow: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridGap: '10px'
    },
    spacer: {
        width: '10px',
        flexShrink: 0
    },
    marginTop: {
        marginTop: '15px'
    }
}));

export const useWorkSpaceStyles = makeStyles(theme => ({
    card: {
        margin: '10px 0'
    },
    row: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    editor: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridGap: '10px'
    },
    editorEntry: {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center'
    },
    editorIcon: {
        color: theme.palette.grey['300']
    },
    editorPoints: {
        marginLeft: '10px'
    },
    gymnasticsInput: {
        marginBottom: '5px'
    },
    gymnasticsInputTitle: {
        maxHeight: '48px',
        marginRight: '5px',
        overflow: 'hidden'
    },
    gymnasticsInputButton: {
        width: '48px',
        height: '48px',
        boxShadow: 'none'
    },
    gymnasticsResult: {
        alignSelf: 'center',
        display: 'flex',
        alignItems: 'center'
    },
    marginTop: {
        marginTop: '15px'
    }
}));

export const useFilterStyles = makeStyles(theme => ({
    filter: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: '10px'
    },
    filterGroup: {
        marginRight: '10px'
    }
}));