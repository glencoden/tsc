import { useCallback, useEffect, useState } from 'react';
import { Button, ButtonGroup } from '@material-ui/core';
import { useFilterStyles } from '../../../styles/styleHooks';
import { useDispatch } from 'react-redux';
import { setFilter } from '../../Competitors/competitorsSlice';
import { Gender, Group } from '../../../competition-logic/values';

const filters = [
    [ Gender.FEMALE, Gender.MALE] ,
    [ Group.A, Group.B ]
];


function ListFilters() {
    const dispatch = useDispatch();
    const classes = useFilterStyles();

    const [ filterList, setFilterList ] = useState([]);

    const dispatchFilter = useCallback(
        filter => dispatch(setFilter(filter)),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    useEffect(() => {
        dispatchFilter(filterList.filter(Boolean));
        return () => dispatchFilter(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ filterList ]);

    return (
        <div className={classes.filter}>
            {filters.map((filterGroup, i) => {
                return (
                    <ButtonGroup
                        variant="contained"
                        key={i}
                        className={classes.filterGroup}
                    >
                        {filterGroup.map(name => {
                            const active = filterList[i] === name;
                            return (
                                <Button
                                    key={name}
                                    color={active ? 'primary' : 'default'}
                                    onClick={() => setFilterList(prevState => {
                                        const result = [ ...prevState ];
                                        if (active) {
                                            result[i] = null;
                                        } else {
                                            result[i] = name;
                                        }
                                        return result;
                                    })}
                                >
                                    {name}
                                </Button>
                            );
                        })}
                    </ButtonGroup>
                );
            })}
        </div>
    );
}

export default ListFilters;