import { useEffect, useState } from 'react';
import { Button, ButtonGroup } from '@material-ui/core';
import { useFilterStyles } from '../../../styles/styleHooks';


function ListFilters({ filters, setFilter }) {
    const classes = useFilterStyles();

    const [ filterList, setFilterList ] = useState([]);

    useEffect(() => {
        setFilter(() => element => filterList.every(fn => typeof fn === 'function' ? fn(element) : true));
    }, [ filterList, setFilter ]);

    return (
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
}

export default ListFilters;