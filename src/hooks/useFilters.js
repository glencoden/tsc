import { useFilterStyles } from '../styles/styleHooks';
import { useEffect, useState } from 'react';
import { Button, ButtonGroup } from '@material-ui/core';

function useFilters(filters) {
    const classes = useFilterStyles();

    const [ filterCallback, setFilterCallback ] = useState(() => () => true);
    const [ filterList, setFilterList ] = useState([]);

    useEffect(() => {
        setFilterCallback(() => element => filterList.every(fn => typeof fn === 'function' ? fn(element) : true));
    }, [ filterList, setFilterCallback ]);

    const FilterComponent = () => (
        <div className={classes.filter}>
            {filters.map((filterGroup, i) => {
                return (
                    <ButtonGroup
                        variant="contained"
                        key={i}
                        className={classes.filterGroup}
                    >
                        {Object.keys(filterGroup).map(name => {
                            const active = filterList[i] === filterGroup[name];
                            return (
                                <Button
                                    key={name}
                                    color={active ? 'primary' : 'default'}
                                    onClick={() => setFilterList(prevState => {
                                        const result = [ ...prevState ];
                                        if (active) {
                                            result[i] = undefined;
                                        } else {
                                            result[i] = filterGroup[name];
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

    return [ filterCallback, FilterComponent ];
}

export default useFilters;